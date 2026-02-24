import React, { useState } from 'react'
import './styles/Contact.css'
import Footer from '../footer/Footer'
import Navbar from '../Navbar'

const Contact = () => {
  const [contactMethod, setContactMethod] = useState(null) // 'whatsapp' ou 'email'
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault()
    setSending(true)

    // Créer le message complet
    const fullMessage = `*NOUVEAU MESSAGE POUR RONY HAIR 237*

*Nom:* ${formData.nom}
*Téléphone:* ${formData.telephone}
*Sujet:* ${formData.sujet}

*Message:*
${formData.message}`

    // Encoder une seule fois tout le message : 696409306/674153984
    const encodedMessage = encodeURIComponent(fullMessage)

    const phoneNumber = '237696409306'
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')

    setTimeout(() => {
      setSending(false)
      setSuccess(true)
      setFormData({ nom: '', email: '', telephone: '', sujet: '', message: '' })
      setTimeout(() => {
        setSuccess(false)
        setContactMethod(null)
      }, 3000)
    }, 1000)
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setSending(true)

    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setFormData({
          nom: '',
          email: '',
          telephone: '',
          sujet: '',
          message: '',
        })
        setTimeout(() => {
          setSuccess(false)
          setContactMethod(null)
        }, 5000)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert("Erreur lors de l'envoi du message")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Navbar categories={[]} />
      <div className='contact-page'>
        <div className='contact-hero'>
          <h1>Contactez-nous</h1>
          <p>Prenez rendez-vous ou posez-nous vos questions</p>
        </div>

        <div className='contact-container'>
          <div className='contact-info'>
            <h2>Nos Coordonnées</h2>

            <div className='info-card'>
              <div className='icon'>
                <svg
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
                  <circle cx='12' cy='10' r='3' />
                </svg>
              </div>
              <div>
                <h3>Adresse</h3>
                <p>Douala, Cameroun</p>
              </div>
            </div>

            <div className='info-card'>
              <div className='icon'>
                <svg
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
                </svg>
              </div>
              <div>
                <h3>Téléphone / WhatsApp</h3>
                <p> 237 696 409 306/ 237 674 153 984</p>
              </div>
            </div>

            <div className='info-card'>
              <div className='icon'>
                <svg
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
                  <polyline points='22,6 12,13 2,6' />
                </svg>
              </div>
              <div>
                <h3>Email</h3>
                <p>tsiguiaremyronald@gmail.com</p>
              </div>
            </div>

            <div className='info-card'>
              <div className='icon'>
                <svg
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <circle cx='12' cy='12' r='10' />
                  <polyline points='12 6 12 12 16 14' />
                </svg>
              </div>
              <div>
                <h3>Horaires d'ouverture</h3>
                <p>Lundi - Samedi : 8h00 - 19h00</p>
                <p>Dimanche : Fermé (sur rendez-vous uniquement)</p>
              </div>
            </div>
          </div>

          <div className='contact-form-wrapper'>
            {!contactMethod ? (
              <div className='contact-method-choice'>
                <h2>Comment souhaitez-vous nous contacter ?</h2>
                <p className='choice-subtitle'>
                  Choisissez le moyen le plus pratique pour vous
                </p>

                <div className='method-buttons'>
                  <button
                    className='method-btn whatsapp-btn'
                    onClick={() => setContactMethod('whatsapp')}
                  >
                    <svg
                      className='method-icon'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                    >
                      <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
                    </svg>
                    <div>
                      <h3>WhatsApp</h3>
                      <p>
                        Pour une réponse rapide et une prise de RDV immédiate
                      </p>
                    </div>
                  </button>

                  <button
                    className='method-btn email-btn'
                    onClick={() => setContactMethod('email')}
                  >
                    <svg
                      className='method-icon'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
                      <polyline points='22,6 12,13 2,6' />
                    </svg>
                    <div>
                      <h3>Email</h3>
                      <p>
                        Pour une demande détaillée ou une question spécifique
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className='form-header'>
                  <button
                    className='btn-back'
                    onClick={() => setContactMethod(null)}
                  >
                    <svg
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path d='M19 12H5M12 19l-7-7 7-7' />
                    </svg>
                    Retour
                  </button>
                  <h2>
                    {contactMethod === 'whatsapp'
                      ? 'Contact rapide via WhatsApp'
                      : 'Contact par Email'}
                  </h2>
                </div>

                {success && (
                  <div className='alert success'>
                    <svg
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
                      <polyline points='22 4 12 14.01 9 11.01' />
                    </svg>
                    Message envoyé avec succès ! Nous vous répondrons dans les
                    plus brefs délais.
                  </div>
                )}

                <form
                  className='contact-form'
                  onSubmit={
                    contactMethod === 'whatsapp'
                      ? handleWhatsAppSubmit
                      : handleEmailSubmit
                  }
                >
                  <div className='form-group'>
                    <label>Nom complet *</label>
                    <input
                      type='text'
                      name='nom'
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      placeholder='Votre nom et prénom'
                    />
                  </div>

                  {contactMethod === 'email' && (
                    <div className='form-group'>
                      <label>Email *</label>
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder='votre@email.com'
                      />
                    </div>
                  )}

                  <div className='form-group'>
                    <label>
                      Téléphone {contactMethod === 'whatsapp' ? '*' : ''}
                    </label>
                    <input
                      type='tel'
                      name='telephone'
                      value={formData.telephone}
                      onChange={handleChange}
                      required={contactMethod === 'whatsapp'}
                      placeholder='+237 6XX XXX XXX'
                    />
                  </div>

                  <div className='form-group'>
                    <label>Sujet *</label>
                    <select
                      name='sujet'
                      value={formData.sujet}
                      onChange={handleChange}
                      required
                    >
                      <option value=''>Sélectionnez un sujet</option>
                      <option value='rendez-vous'>Prise de rendez-vous</option>
                      <option value='info'>
                        Demande d'information sur les prestations
                      </option>
                      <option value='tarifs'>
                        Demande de tarifs / forfaits
                      </option>
                      <option value='formation'>
                        Inscription à une formation
                      </option>
                      <option value='partenariat'>
                        Partenariat / Collaboration
                      </option>
                      <option value='autre'>Autre</option>
                    </select>
                  </div>

                  <div className='form-group'>
                    <label>Message *</label>
                    <textarea
                      name='message'
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows='6'
                      placeholder='Décrivez votre demande (prestation souhaitée, date envisagée, question spécifique...)'
                    />
                  </div>

                  <button
                    type='submit'
                    className='btn-submit'
                    disabled={sending}
                  >
                    {sending
                      ? 'Envoi en cours...'
                      : `Envoyer via ${contactMethod === 'whatsapp' ? 'WhatsApp' : 'Email'}`}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Contact
