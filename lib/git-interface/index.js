var exports = module.exports = {}

var Git = require('nodegit')

var path = require('path')
var promisify = require('promisify-node')
var fse = promisify(require('fs-extra'))

var config = require('config')
var directoryName = 'bills'

var log = require('debug')('billtracker:git')
var async = require('async')

// fix por async. see https://github.com/nodegit/nodegit/blob/master/examples/add-and-commit.js#L8
fse.ensureDir = promisify(fse.ensureDir)

exports.commit = function commit (req, res, next) {
  var billContents = req.body.contents
  var billID = req.body.billID

  if (!billContents) {
    log('No change in contents for Bill ' + billID)
    return next()
  }

  var fileName = billID + '.txt'

  var repo
  var index
  var oid

  Git.Repository.open(config.billsGitPath)
    .then(function (repository) {
      repo = repository
      return fse.ensureDir(path.join(repo.workdir(), directoryName))
    })
    .then(function () {
      return fse.writeFile(path.join(repo.workdir(), directoryName, fileName), billContents)
    })
    .then(function () {
      return repo.openIndex()
    })
    .then(function (indexResult) {
      index = indexResult
      return index.read(1)
    })
    .then(function () {
      return index.addByPath(path.join(directoryName, fileName))
    })
    .then(function () {
      return index.write()
    })
    .then(function () {
      return index.writeTree()
    })
    .then(function (oidResult) {
      oid = oidResult
      return Git.Reference.nameToId(repo, 'HEAD')
    })
    .then(function (head) {
      return repo.getCommit(head)
    })
    .then(function (parent) {
      var committer = Git.Signature.now('Bill Tracker', 'billtracker@democraciaenred.com')
      var author = Git.Signature.now('Bill Tracker', 'billtracker@democraciaenred.com')

      return repo.createCommit('HEAD', author, committer, 'Commited new revision for Bill ' + billID, oid, [parent])
    })
    .then(function (commitID) {
      log('Bill with ID ' + billID + ' commited to git')
      log('New Commit: ', commitID)
      req.commitID = commitID
      return repo.getCommit(commitID)
    })
    .then(function (commit) {
      req.commitDate = commit.date()
      return next()
    })
}

function readFileFromGit (billID, commitID, callback) {
  Git.Repository.open(config.billsGitPath)
    .then(function (repo) {
      return repo.getCommit(commitID)
    })
    .then(function (commit) {
      return commit.getEntry('bills/' + billID + '.txt')
    })
    .then(function (entry) {
      return entry.getBlob()
    })
    .then(function (blob) {
      return blob.toString()
    })
    .done(callback)
}

exports.readFullFileHistory = function readFullFileHistory (req, res, next) {
  // TO-DO should not reach here without a Bill, why wasn't it catched before?
  if (!req.billID) {
    log('Cannot read git history of null Bill ID')
    return next(new Error('Cannot read git history of null Bill'))
  }

  readCommitHistory(req.billID, function (commits) {
    var calls = []

    commits.forEach(function (entry) {
      calls.push(function (callback) {
        readFileFromGit(req.billID, entry.commit.sha(), function (contents) {
          req.stages.forEach(function (aStage) {
            if (aStage.stageID === entry.commit.sha()) {
              aStage.contents = contents
              aStage.contentsDate = entry.commit.date()
            }
          })

          callback(null, contents)
        })
      })
    })

    async.parallel(calls, function (err, result) {
      if (!err) return next()
    })
  })
}

function readCommitHistory (billID, callback) {
  var walker
  var repo
  var filename

  filename = 'bills/' + billID + '.txt'
  Git.Repository.open(config.billsGitPath)
    .then(function (r) {
      repo = r
      return repo.getMasterCommit()
    })
    .then(function (firstCommitOnMaster) {
      walker = repo.createRevWalk()
      walker.push(firstCommitOnMaster.sha())
      walker.sorting(Git.Revwalk.SORT.Time)

      return walker.fileHistoryWalk(filename, 500)
    })
    .then(callback)
    .done()
}

exports.getDiffBetweenCommits = function (req, res, next) {
  var commitID1 = req.params.stageID1
  var commitID2 = req.params.stageID2

  log('diffing commits', commitID1, commitID2)

  var repo

  log('repo is located at: ' + config.billsGitPath)

  Git.Repository.open(config.billsGitPath)
    .then(function (repository) {
      repo = repository
      log('opened repository. Getting commit: ' + commitID1)
      return repo.getCommit(commitID1)
    })
    .then(function (firstCommit) {
      req.commit1 = firstCommit
      log('loaded commit ' + commitID1 + '. getting commit: ' + commitID2)
      return repo.getCommit(commitID2)
    })
    .then(function (commit2) {
      req.commit2 = commit2
      req.gitOptions = null
      log('loaded commit ' + commitID2)
      return
    })
    .then(function () {
      log('commit1 getTree')
      return req.commit1.getTree()
    })
    .then(function (commitTree) {
      req.commit1Tree = commitTree
      log('first tree loaded')
      return req.commit2.getTree()
    })
    .then(function (commitTree) {
      req.commit2Tree = commitTree
      log('second tree loaded')
      return
    })
    .then(function () {
      log('diff between trees')
      return req.commit1Tree.diffWithOptions(req.commit2Tree, {
        contextLines: 9999999
      })
    })
    .then(function (diffs) {
      var diffResult = []
      req.diffResult = diffResult

      log('diffs loaded')

      var context = {
        next: next,
        diffResult: diffResult,
        modificationCount: 0,
        pushPatches: function (patches) {
          log('pushPatches' + patches)
          this.patches = patches
          this.currentPatch = -1
        },
        nextPatch: function () {
          log('nextPatch ' + this.currentPatch)
          this.currentPatch++
          if (this.currentPatch !== this.patches.length) {
            this.patches[this.currentPatch].hunks().then(processHunks.bind(null, this))
          } else {
            this.next()
          }
        },
        pushHunks: function (hunks) {
          log('pushHunks ' + hunks)
          this.hunks = hunks
          this.currentHunk = -1
        },
        nextHunk: function () {
          log('nextHunk ' + this.currentHunk)
          this.currentHunk++
          if (this.currentHunk !== this.hunks.length) {
            this.hunks[this.currentHunk].lines().then(processLines.bind(null, this))
          } else {
            this.nextPatch()
          }
        },
        increaseModificationCount: function () {
          log('increaseModificationCount ' + this.modificationCount)
          this.modificationCount++
          req.modificationCount = this.modificationCount
        }
      }

      log('before traversing patches')
      diffs.patches().then(processPatches.bind(null, context))
      log('after calling traversing patches')
    })
}

function processPatches (context, patches) {
  if (patches.length === 0) {
    return context.next()
  }

  context.pushPatches(patches)
  context.nextPatch()
}

function processHunks (context, hunks) {
  if (hunks.length === 0) {
    return context.next()
  }

  context.pushHunks(hunks)
  context.nextHunk()
}

function processLines (context, lines) {
  lines.forEach(function (line) {
    var originChar = String.fromCharCode(line.origin())

    var diffLine = {
      contents: line.content(),
      originChar: originChar,
      isAddition: originChar === '+',
      isDeletion: originChar === '-',
      isContext: originChar === ' '
    }

    if (diffLine.isAddition || diffLine.isDeletion) {
      context.increaseModificationCount()
    }

    context.diffResult.push(diffLine)
  })

  context.nextHunk()
}
