import React, { useState } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_int, validate_string } from '../../Utility/Validation/uiValidation'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import StyledTextArea from '../../Utility/StyledTextArea/StyledTextArea'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import { generate_slug } from '../../Utility/Stringer/uiStringer'



const EditTodoForm = props => {

   const [id] = useState(props.todo.id)
   const [task_id] = useState(props.todo.task_id)
   const [title,setTitle] = useState(props.todo.title || '')
   const [author_id,setAuthorId] = useState(props.todo.author_id || 0)
   const [outline,setOutline] = useState(props.todo.outline || '')
   const [title_feedback,setTitleFeedback] = useState('')
   const [author_id_feedback,setAuthorIdFeedback] = useState('')
   const [outline_feedback,setOutlineFeedback] = useState('')
   const [pin,setPin] = useState(props.todo.pin > 0 ? true : false)
   const [is_on_going,setIsOnGoing] = useState(props.todo.on_going > 0 ? true : false)

   const handleSubmit = e => {
      
      setTitleFeedback('')
      setAuthorIdFeedback('')
      setOutlineFeedback('')
      e.preventDefault()

      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());
      formJson.pin = pin
      formJson.on_going = is_on_going

      let validated = true
      
      formJson['title'] = formJson['title'].trim()

      if(!props.is_unique(formJson['id'],'title',formJson['title'])) {
         setTitleFeedback('This title already exists, please enter a different title.')
         validated = false
      }

      if(!validate_string(formJson['title'],{'min_length':10,'max_length':80},setTitleFeedback)) {
         validated = false
      } else {
         formJson['slug'] = generate_slug(formJson['title'])
      }

      if(!validate_int(formJson['author_id'],{},setAuthorIdFeedback)) {
         validated = false
      }
      if(!validate_string(formJson['outline'],{'min_length':10,'max_length':500},setOutlineFeedback)) {
         validated = false
      }
      
      if(validated) props.onSubmit(formJson)
   }

   const toggle_pin = () => {
      setPin(!pin)
   } 
   const toggle_ongoing = () => {
      setIsOnGoing(!is_on_going)
   }

   return (
      <form onSubmit={handleSubmit} className="p-3 px-4">

         <h5 className="text-2xl mb-5">Edit Todo</h5>

         <input type="hidden" name="id" value={id || 0} />

         <input type="hidden" name="task_id" value={task_id || 0} />

         <input type="hidden" name="done_at" value={props.todo.done_at ? props.todo.done_at : ''} />

         <FormElement>
            <label htmlFor="title" className="w-12/12 md:w-2/12">Title</label>
            <StyledInput 
               name="title" 
               value={title || ''} 
               onChanged={setTitle}></StyledInput>
         </FormElement>

         <FormElementFeedback feedback_msg={title_feedback}/>

         <FormElement>
            <label htmlFor="author_id" className="w-12/12 md:w-2/12">Author Id</label>
            <StyledInput 
               name="author_id" 
               value={author_id || ''} 
               onChanged={setAuthorId}></StyledInput>
         </FormElement>

         <FormElementFeedback feedback_msg={author_id_feedback}/>

         <FormElement>
               <label htmlFor="outline" className="w-12/12 md:w-2/12">Outline</label>
               <StyledTextArea 
                  name="outline" 
                  value={outline || ''}
                  placeholder=""
                  onChanged={setOutline}></StyledTextArea>
         </FormElement>

         <FormElementFeedback feedback_msg={outline_feedback}/>

         <div className="flex justify-end gap-1">

            <div className="flex gap-2 items-center text-slate-400 text-sm mr-7">
               <input 
                  name="on_going"
                  type="checkbox" 
                  checked={is_on_going || false}
                  value=''
                  onChange={e => {toggle_ongoing(e.target.checked)}} 
               />mark as on-going
            </div>
         <div className="flex gap-2 items-center text-slate-400 text-sm mr-7">
            <input 
               name="pin"
               type="checkbox" 
               checked={pin || false}
               value=''
               onChange={e => {toggle_pin(e.target.checked)}} 
            />pin to start of task list
         </div>
            <StyledButton aria-label="Apply." type="submit">Apply</StyledButton>
            <StyledButton aria-label="Delete." onClicked={props.onDelete}>Delete</StyledButton>
            <StyledButton aria-label="Cancel." onClicked={props.close_modal}>Cancel</StyledButton>
         </div>
      </form>
   )
}

export default EditTodoForm