'use client'
import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg'
import phone from '@/assets/images/phone.png'
import mail from '@/assets/images/mail.png'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react'
import email from '@emailjs/browser';

interface FormData {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  message: string
}

export const ContactSection = () => {

  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: '',
    email: "",
    phone: "",
    message: '',
  })
  const handleChange = (
    { target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const templateParams = {
      from_name: form.firstName + ' ' + form.lastName,
      to_name: 'Kaveri Raut',
      from_email: form.email,
      to_email: 'rautkaveri88@gmail.com',
      message: form.message,
    };
    try {

      await email.send(
        'service_zzmfpsl',
        'template_8t0ytcn',
        templateParams,
        '_zNriF0ietq8RPTfs'
      );

      setLoading(false)

      alert('Your message has been send!')
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      setLoading(false)
      console.log(error)
      alert('Something went wrong!')
    }
  };
  const router = useRouter();
  return (
    <div className=' relative z-10 py-16 pt-12 lg:py-24 lg:pt-20 ' id='contact'>
      <div className='container '>
        <div className="bg-gradient-to-r from-emerald-300 to-sky-400 text-gray-900 py-8 px-10 rounded-3xl text-center md:text-left">
          <div className='flex flex-col md:flex-row gap-8 md:gap-16 items-center'>
            <div >
              <h2 className='font-serif text-2xl font-extrabold md:text-3xl'>Let&apos;s create something amazing together.</h2>
              <p className='text-sm mt-2 md:text-base'>
                Ready to bring your next project to life? Let&apos;s connect and dicuss how
                I can help you achieve your goals.
              </p>
            </div>
            <div>
              <button className='text-white bg-gray-900 inline-flex px-6 h-12 items-center rounded-xl gap-2 w-max border border-gray-900'>
                <span className='font-semibold'>Contact Me</span>
                <ArrowUpRightIcon className='size-4' />
              </button>
            </div>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row text-white/70 p-8 rounded-lg space-y-8 lg:space-x-8 lg:space-y-0'>
          <div className='flex justify-center items-center' >
            <ul className='space-y-4'>
              <li className='flex flex-col md:flex-row items-center gap-0'>
                <Image src={phone} alt='phone' className='h-[110px] w-auto mr-6' />
                <p className='text-lg'>+919284673600</p>
              </li>
              <li className='flex flex-col md:flex-row items-center'>
                <Image src={mail} alt='phone' className='h-[110px] w-auto mr-6' />
                <p className='text-base w-fit'>rautkaveri88@gmail.com</p>
              </li>
            </ul>
          </div>
          <div className='bg-white/10 p-6 rounded-xl max-w-[550px]'>
            <h2 className='text-3xl font-bold bg-gradient-to-r from-emerald-300 to-sky-400 text-transparent bg-clip-text mb-4 md:5xl'>Let&apos;s Connect</h2>
            <p className='text-white/70 mb-6'> Send me a message and lets connect !</p>
            <form ref={formRef} onSubmit={handleSubmit} action="https://getform.io/f/aejrjmpb" method='POST' className='space-y-4'>
              <div className='grid md:grid-cols-2 gap-4 w-fit'>
                <input type='firstname' name='firstName' required value={form.firstName} onChange={handleChange} className='bg-black/70 w-full rounded-xl p-3 focus:text-black/70 font-semibold focus:outline-none focus:ring-2 focus:bg-gradient-to-r from-emerald-300 to-sky-400' placeholder='First Name' />
                <input type='lastname' name='lastName' required value={form.lastName} onChange={handleChange} className='bg-black/70 w-full rounded-xl p-3 focus:text-black/70 font-semibold focus:outline-none focus:ring-2 focus:bg-gradient-to-r from-emerald-300 to-sky-400' placeholder='Last Name' />
                <input type='email' name='email' required value={form.email} onChange={handleChange} className='bg-black/70  w-full rounded-xl p-3 focus:text-black/70 font-semibold focus:outline-none focus:ring-2 focus:bg-gradient-to-r from-emerald-300 to-sky-400' placeholder='Email' />
                <input type='phone' name='phone' required value={form.phone} onChange={handleChange} className='bg-black/70  w-full rounded-xl p-3 focus:text-black/70 font-semibold focus:outline-none focus:ring-2 focus:bg-gradient-to-r from-emerald-300 to-sky-400' placeholder='Phone No.' />
              </div>
              <textarea value={form.message} name='message' onChange={handleChange} required className='bg-black/70 w-full focus:text-black/70 font-semibold rounded-xl p-3 focus:outline-none focus:ring-2  focus:bg-gradient-to-r from-emerald-300 to-sky-400' placeholder='Your Message' />
              <button type='submit' disabled={loading} className='bg-gradient-to-r from-emerald-300 to-sky-400 hover:bg-gradient-to-l text-black/80 w-full px-6 py-2 font-semibold rounded-xl text-xl'>{loading ? 'Sending...' : 'Send Message'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>)
};
