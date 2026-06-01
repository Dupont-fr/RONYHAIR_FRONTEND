import React from 'react'
import Navbar from '../Navbar'
import Footer from '../footer/Footer'
import './styles/Legal.css'

const Confidentialite = () => {
  return (
    <>
      <Navbar categories={[]} />
      <div className='legal-page'>
        <div className='legal-hero'>
          <div className='legal-hero-icon'>
            <svg width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/>
              <path d='M7 11V7a5 5 0 0 1 10 0v4'/>
            </svg>
          </div>
          <h1>Politique de Confidentialité</h1>
          <p>Dernière mise à jour : Février 2026</p>
        </div>

        <div className='legal-content'>
          <section>
            <h2>1. Introduction</h2>
            <p>
              RONY HAIR 237 accorde une grande importance à la protection de vos
              données personnelles. Cette politique de confidentialité explique
              quelles informations nous collectons, comment nous les utilisons
              et quels sont vos droits.
            </p>
          </section>

          <section>
            <h2>2. Données Collectées</h2>
            <p>Nous collectons les informations suivantes :</p>
            <ul>
              <li>
                <strong>Données d'identification :</strong> nom, prénom
              </li>
              <li>
                <strong>Données de contact :</strong> numéro de téléphone,
                adresse email
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Utilisation des Données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Gérer vos prises de rendez-vous</li>
              <li>Vous contacter concernant vos prestations</li>
              <li>Améliorer nos services et votre expérience en institut</li>
              <li>
                Vous envoyer des offres spéciales et promotions (avec votre
                consentement)
              </li>
              <li>Respecter nos obligations légales et réglementaires</li>
            </ul>
          </section>

          <section>
            <h2>4. Base Légale du Traitement</h2>
            <p>Le traitement de vos données repose sur :</p>
            <ul>
              <li>L'exécution d'un contrat (prestations de services)</li>
              <li>Votre consentement (offres marketing, promotions)</li>
              <li>Notre intérêt légitime (amélioration des services)</li>
              <li>Le respect d'obligations légales</li>
            </ul>
          </section>

          <section>
            <h2>5. Partage des Données</h2>
            <p>
              Nous ne vendons jamais vos données personnelles. Vos informations
              peuvent être partagées uniquement avec :
            </p>
            <ul>
              <li>
                Nos prestataires de services (paiement, prise de rendez-vous)
              </li>
              <li>Les autorités légales si requis par la loi</li>
              <li>
                Nos partenaires, uniquement avec votre consentement explicite
              </li>
            </ul>
          </section>

          <section>
            <h2>6. Conservation des Données</h2>
            <p>
              Nous conservons vos données personnelles uniquement pendant la
              durée nécessaire aux finalités pour lesquelles elles ont été
              collectées :
            </p>
            <ul>
              <li>Historique des prestations : 5 ans</li>
              <li>Données marketing : jusqu'à retrait du consentement</li>
            </ul>
          </section>

          <section>
            <h2>7. Sécurité des Données</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles
              appropriées pour protéger vos données contre tout accès,
              modification, divulgation ou destruction non autorisés.
            </p>
          </section>

          <section>
            <h2>8. Vos Droits</h2>
            <p>
              Conformément à la réglementation, vous disposez des droits
              suivants :
            </p>
            <ul>
              <li>
                <strong>Droit d'accès :</strong> obtenir une copie de vos
                données
              </li>
              <li>
                <strong>Droit de rectification :</strong> corriger vos données
                inexactes
              </li>
              <li>
                <strong>Droit à l'effacement :</strong> supprimer vos données
              </li>
              <li>
                <strong>Droit d'opposition :</strong> vous opposer au traitement
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> récupérer vos données
              </li>
              <li>
                <strong>Droit de limitation :</strong> limiter le traitement
              </li>
            </ul>
            <p>
              Pour exercer vos droits, contactez-nous à :
            </p>
            <a className='legal-contact-link' href='mailto:tsiguiaremyronald@gmail.com'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/>
                <polyline points='22,6 12,13 2,6'/>
              </svg>
              tsiguiaremyronald@gmail.com
            </a>
          </section>

          <section>
            <h2>9. Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience de
              navigation. Vous pouvez configurer votre navigateur pour refuser
              les cookies, mais cela peut affecter certaines fonctionnalités du
              site.
            </p>
          </section>

          <section>
            <h2>10. Modifications de la Politique</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de
              confidentialité à tout moment. Les modifications seront publiées
              sur cette page avec une nouvelle date de mise à jour.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité
              ou l'utilisation de vos données, contactez-nous :
            </p>
            <div className='legal-contact-list'>
              <a className='legal-contact-link' href='mailto:tsiguiaremyronald@gmail.com'>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/>
                  <polyline points='22,6 12,13 2,6'/>
                </svg>
                tsiguiaremyronald@gmail.com
              </a>
              <a className='legal-contact-link' href='tel:696409306'>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'/>
                </svg>
                +237 696 409 306
              </a>
              <a className='legal-contact-link' href='tel:674153984'>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'/>
                </svg>
                +237 674 153 984
              </a>
              <div className='legal-contact-link legal-contact-address'>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/>
                  <circle cx='12' cy='10' r='3'/>
                </svg>
                Douala, Cameroun
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Confidentialite
