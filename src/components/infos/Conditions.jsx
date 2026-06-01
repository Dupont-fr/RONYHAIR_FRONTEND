import React from 'react'
import Navbar from '../Navbar'
import Footer from '../footer/Footer'
import './styles/Legal.css'

const Conditions = () => {
  return (
    <>
      <Navbar categories={[]} />
      <div className='legal-page'>
        <div className='legal-hero'>
          <div className='legal-hero-icon'>
            <svg width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/>
              <polyline points='14 2 14 8 20 8'/>
              <line x1='16' y1='13' x2='8' y2='13'/>
              <line x1='16' y1='17' x2='8' y2='17'/>
            </svg>
          </div>
          <h1>Conditions d'Utilisation</h1>
          <p>Dernière mise à jour : Février 2026</p>
        </div>

        <div className='legal-content'>
          <section>
            <h2>1. Acceptation des Conditions</h2>
            <p>
              En accédant et en utilisant le site de RONY HAIR 237, vous
              acceptez d'être lié par ces conditions d'utilisation. Si vous
              n'acceptez pas ces conditions, veuillez ne pas utiliser notre
              site.
            </p>
          </section>

          <section>
            <h2>2. Utilisation du Site</h2>
            <p>
              Vous vous engagez à utiliser ce site uniquement à des fins légales
              et de manière à ne pas porter atteinte aux droits de tiers.
            </p>
            <ul>
              <li>Ne pas utiliser le site de manière frauduleuse</li>
              <li>Ne pas tenter d'accéder à des zones non autorisées</li>
              <li>Respecter la propriété intellectuelle</li>
            </ul>
          </section>

          <section>
            <h2>3. Prise de Rendez-vous et Paiements</h2>
            <p>
              Toutes les demandes de rendez-vous sont soumises à confirmation.
              Nous nous réservons le droit d'annuler toute réservation en cas de
              suspicion de fraude ou d'indisponibilité des prestations.
            </p>
            <ul>
              <li>Les tarifs sont indiqués en FCFA</li>
              <li>Un acompte peut être demandé pour certaines prestations</li>
              <li>Les règlements s'effectuent directement en institut</li>
            </ul>
          </section>

          <section>
            <h2>4. Annulation et Rendez-vous</h2>
            <p>
              En cas d'empêchement, nous vous remercions de nous prévenir au
              moins 24 heures à l'avance. Tout rendez-vous non annulé dans ce
              délai pourra être facturé.
            </p>
          </section>

          <section>
            <h2>5. Conditions des Prestations</h2>
            <p>
              Nos prestations de coiffure, soins du visage, massages, onglerie
              et makup sont réalisées par des professionnels. En cas de
              contre-indication médicale (allergies, problèmes de peau, etc.),
              il est de votre responsabilité d'en informer notre équipe avant
              toute prestation.
            </p>
          </section>

          <section>
            <h2>6. Garantie et Satisfaction</h2>
            <p>
              Votre satisfaction est notre priorité. Si une prestation ne vous
              convient pas, veuillez nous en faire part dans les 48 heures afin
              que nous puissions trouver une solution adaptée.
            </p>
          </section>

          <section>
            <h2>7. Propriété Intellectuelle</h2>
            <p>
              Tous les contenus présents sur ce site (textes, images, logos,
              vidéos) sont la propriété exclusive de RONY HAIR 237 ou de ses
              partenaires. Toute reproduction sans autorisation est strictement
              interdite.
            </p>
          </section>

          <section>
            <h2>8. Limitation de Responsabilité</h2>
            <p>
              RONY HAIR 237 ne saurait être tenu responsable des dommages
              directs ou indirects résultant de l'utilisation du site ou de
              l'impossibilité d'y accéder, ni des éventuelles réactions
              allergiques non signalées au préalable.
            </p>
          </section>

          <section>
            <h2>9. Modification des Conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout
              moment. Les nouvelles conditions seront applicables dès leur mise
              en ligne.
            </p>
          </section>

          <section>
            <h2>10. Loi Applicable</h2>
            <p>
              Ces conditions sont régies par le droit camerounais. Tout litige
              sera soumis aux tribunaux compétents de Yaoundé, Cameroun.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Conditions
