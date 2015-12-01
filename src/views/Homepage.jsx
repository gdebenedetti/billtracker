/**
 * Module Dependencies
 */

import React, { Component } from 'react'
import { Link } from 'react-router'

export default class Homepage extends Component {
  render () {
    return <div>
      <div className="row">
         <div className="medium-7 large-6 columns">
            <h1>Conoce de dónde viene y hacia dónde van las leyes del congreso</h1>
            <p className="subheader">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lobortis ornare risus a tempus. Nulla vitae fringilla risus. Donec lobortis non lacus sit amet dignissim. Fusce posuere consectetur leo et fringilla. In hac habitasse platea dictumst.</p>
         </div>
         <div className="medium-5 large-3 columns">
            <div className="callout secondary">
               <form>
                  <div className="row">
                     <div className="small-12 columns">
                      <h4>Busca una ley</h4>
                     </div>
                  </div>
                  <div className="row">
                     <div className="small-12 columns">
                        <label>Palabras clave
                        <input type="text" />
                        </label>
                     </div>
                     <div className="small-12 columns">
                        <label>Categoría
                        <select>
                          <option>Seleccione una cateogría</option>
                          <option>Seguridad</option>
                          <option>Economía</option>
                          <option>Educación</option>
                          <option>Ambiente</option>
                        </select>
                        </label>
                        <button type="submit" className="button">Buscar</button>
                     </div>
                  </div>
               </form>
            </div>
         </div>
      </div>
      <div className="row column">
         <hr />
      </div>
      <div className="row column">
         <p className="lead">Leyes</p>
      </div>
      <div className="row small-up-1 medium-up-2 large-up-3">
         <div className="column">
            <div className="callout">
               <h2><Link to="/leyes/dar-un-predio-en-concesion-a-un-club-de-golf">Dar un predio en concesión a un club de golf</Link></h2>
               <p className="lead">Despacho 766/2014</p>
               <p className="subheader">Se propone concesionar por un período de <strong>20 años</strong>, el predio del Parque Las Victorias (Avda. Coronel Roca 5025 - Villa Lugano - Comuna 8) a la Asociación Civil sin fines de lucro ¨Golf Club José Jurado¨, a cambio de que <strong>inviertan</strong> en proyectos para la comunidad, becas, mantenimiento del terreno y la construcción de un jardín materno infantil.</p>
            </div>
         </div>
         <div className="column">
            <div className="callout">
               <h2>Boleto Estudiantil en la Ciudad</h2>
               <p className="lead">Despacho 285-D-2014</p>
               <p className="subheader">Este proyecto busca otorgar una reducción en la tarifa del subte durante el ciclo lectivo para los estudiantes y docentes con residencia en la Ciudad de Buenos Aires, beneficio al que se conoce como "Boleto Estudiantil".</p>
            </div>
         </div>
         <div className="column">
            <div className="callout">
               <h2>Campaña contra el abuso de alcohol al volante</h2>
               <p className="lead">Despacho 267-2014</p>
               <p className="subheader">El siguiente proyecto propone la inclusión de la leyenda "<em>Valorá tu vida y la de los demás. Si vas a conducir no tomes</em>"; en las cartas y en el interior de los locales donde se expenden bebidas alcohólicas.</p>
            </div>
         </div>
         <div className="column">
            <div className="callout">
               <h2>Limitación a las acciones de las agencias de cobranza</h2>
               <p className="lead">Despacho 281-2014</p>
               <p className="subheader">La Ley Nacional 26.361 incorporó a los derechos de los consumidores y los usuarios la posibilidad de que los consumidores pudieran denunciar situaciones vergonzantes, vejatorias o intimidatorias como "trato indigno".</p>
            </div>
         </div>
         <div className="column">
            <div className="callout">
               <h2>Denominar “Federación de Rusia” a un cantero en Puerto Madero</h2>
               <p className="lead">Despacho 1718-2014</p>
               <p className="subheader">El siguiente proyecto busca denomínar “Federación de Rusia” al cantero ubicado en la calle Azucena Villaflor entre Aimé Painé y Av. De los Italianos, en el barrio de Puerto Madero.</p>
            </div>
         </div>
         <div className="column">
            <div className="callout">
               <h2>Emergencia de energia eléctrica en villas</h2>
               <p className="lead">Despacho 1731-2014</p>
               <p className="subheader">Se propone declarar la emergencia del suministro de energía eléctrica en Villas, asentamientos y similares.<br/><br/>Se entiende por "emergencia" a la falta de tendido eléctrico y de alumbrado público, la carencia al acceso de suministro en hogares y la presencia de conexiones con riesgo de vida.</p>
            </div>
         </div>
      </div>
      <div className="row column">
         <a className="button hollow expanded">Cargar más</a>
      </div>
    </div>
  }
}