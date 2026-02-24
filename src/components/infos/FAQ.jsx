import React, { useState } from 'react'
import Navbar from '../Navbar'
import Footer from '../footer/Footer'
import './styles/FAQ.css'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      category: 'Rendez-vous',
      questions: [
        {
          q: 'Comment prendre rendez-vous ?',
          a: 'Vous pouvez prendre rendez-vous directement sur notre site en cliquant sur le boutton de réservation, ou nous contacter par téléphone ou WhatsApp pour une prise de rendez-vous rapide.',
        },
        {
          q: 'Puis-je modifier mon rendez-vous après confirmation ?',
          a: "Une modification est possible jusqu'à 24h avant votre rendez-vous. Contactez-nous rapidement au +237 656 173 692 pour ajuster votre créneau.",
        },
        {
          q: 'Comment annuler un rendez-vous ?',
          a: "Vous pouvez annuler votre rendez-vous par téléphone ou email. Merci de nous prévenir au moins 24h à l'avance pour permettre à d'autres clientes de bénéficier du créneau.",
        },
      ],
    },
    {
      category: 'Paiement',
      questions: [
        {
          q: 'Quels moyens de paiement acceptez-vous ?',
          a: 'Nous acceptons les paiements par Mobile Money (Orange Money, MTN Mobile Money), virement bancaire, espèces et carte bancaire directement en institut.',
        },
        {
          q: 'Faut-il payer un acompte ?',
          a: 'Pour certaines prestations ou forfaits, un acompte peut être demandé lors de la réservation. Celui-ci sera déduit du montant total de votre prestation.',
        },
      ],
    },
    {
      category: 'Prestations',
      questions: [
        {
          q: 'Quels services proposez-vous ?',
          a: 'Nous proposons une large gamme de services : coiffure pour femmes, hommes et enfants, soins du visage et du corps, gommage corporel et hammam, massages relaxants, onglerie, makeup, ainsi que des formations en beauté.',
        },
        {
          q: 'Proposez-vous des forfaits ?',
          a: 'Oui ! Nous avons plusieurs forfaits bien-être combinant plusieurs prestations (coiffure + soin, massage + hammam, etc.). Contactez-nous pour découvrir nos offres du moment.',
        },
        {
          q: 'Utilisez-vous des produits adaptés à tous types de peaux ?',
          a: 'Nos produits sont sélectionnés avec soin et conviennent à la plupart des types de peaux. Si vous avez une peau sensible ou des allergies, merci de nous en informer avant la prestation.',
        },
      ],
    },
    {
      category: 'Formations',
      questions: [
        {
          q: 'Quelles formations proposez-vous ?',
          a: 'Nous proposons des formations professionnelles en coiffure, onglerie, maquillage et soins esthétiques. Nos formations sont accessibles aux débutants comme aux professionnels souhaitant se perfectionner.',
        },
        {
          q: "Comment s'inscrire à une formation ?",
          a: 'Vous pouvez vous inscrire directement en institut ou nous contacter par téléphone/email. Un programme détaillé et un devis vous seront transmis sur demande.',
        },
        {
          q: 'Les formations sont-elles certifiantes ?',
          a: "Oui, à l'issue de chaque formation, une attestation de formation vous est délivrée. Pour certaines formations, une certification professionnelle peut être obtenue.",
        },
      ],
    },
    {
      category: 'Soins & Bien-être',
      questions: [
        {
          q: 'Y a-t-il des contre-indications aux soins ?',
          a: 'Certains soins peuvent être déconseillés aux femmes enceintes ou aux personnes souffrant de problèmes de santé spécifiques. Un questionnaire vous sera remis avant chaque soin pour évaluer les éventuelles contre-indications.',
        },
        {
          q: 'Comment se prépare-t-on pour un hammam ?',
          a: "Il est recommandé de boire de l'eau avant la séance et d'éviter les repas lourds. Apportez votre maillot de bain, nous fournissons serviettes et produits de soin.",
        },
        {
          q: "Quelle est la durée d'une séance de massage ?",
          a: "Nos massages durent entre 30 minutes et 2 heures selon le type de soin choisi. Vous pouvez opter pour un massage relaxant, aux pierres chaudes ou bien un gommage suivi d'un massage.",
        },
      ],
    },
  ]

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Composant pour l'icône de point d'interrogation
  const QuestionMarkIcon = () => (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='currentColor'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z' />
    </svg>
  )

  // Composant pour l'icône d'enveloppe
  const EmailIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='currentColor'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' />
    </svg>
  )

  // Composant pour l'icône de téléphone
  const PhoneIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='currentColor'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' />
    </svg>
  )

  return (
    <>
      <Navbar categories={[]} />
      <div className='faq-page'>
        <div className='faq-hero'>
          <h1>
            <QuestionMarkIcon />
            Questions Fréquentes
          </h1>
          <p>
            Trouvez rapidement des réponses à vos questions sur nos services
          </p>
        </div>

        <div className='faq-content'>
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className='faq-section'>
              <h2 className='faq-category'>{section.category}</h2>

              {section.questions.map((item, itemIndex) => {
                const globalIndex = `${sectionIndex}-${itemIndex}`
                const isOpen = openIndex === globalIndex

                return (
                  <div
                    key={itemIndex}
                    className={`faq-item ${isOpen ? 'open' : ''}`}
                  >
                    <button
                      className='faq-question'
                      onClick={() => toggle(globalIndex)}
                    >
                      <span>{item.q}</span>
                      <span className='faq-icon'>{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className='faq-answer'>
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}

          <div className='faq-contact'>
            <h3>Vous ne trouvez pas de réponse ?</h3>
            <p>Notre équipe est là pour vous aider !</p>
            <div className='contact-buttons'>
              <a href='/contact' className='btn-contact'>
                <EmailIcon />
                Nous contacter
              </a>

              <a href='tel:696409306' className='btn-phone'>
                <PhoneIcon />
                Appeler
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default FAQ
