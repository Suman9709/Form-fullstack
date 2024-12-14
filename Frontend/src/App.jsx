
import './App.css'
import Button from './Components/Button'
import InputBox from './Components/InputBox'

function App() {

  return (
    <>
    <div>
      <div className='flex justify-center items-center mt-2 text-4xl'> 
      Registration Form 
      </div>

      <div>
        <form className='flex items-center justify-center mt-16 flex-col m-2 border-4 p-4 border-violet-900' >
         <div className="grid gap-6 mb-6 md:grid-cols-1 w-1/2 ">
         <InputBox
          label="First Name"
          id="first_name"
          placeholder="Enter your first name"
          required={true}

          />

          <InputBox
          label="Last Name"
          id="last_name"
          placeholder="Enter your last name"
          required={true}
          />

          
          <InputBox
          label="Date Of Birth"
          id="dob"
          placeholder="dd/mm/yyyy"
          type='Date'
          required={true}
          />

          <InputBox
          label="Email"
          id="email"
          placeholder="Enter your mail id"
          type='email'
          required={true}
          />
         </div>
        <div className='flex gap-2'>
        <Button 
         label="Submit"
         />
          <Button 
         label="Cancel"
         />
        </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default App
