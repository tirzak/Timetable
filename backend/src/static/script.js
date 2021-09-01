


const createSchedule=()=>{
  let doc = document.getElementById('create-schedule-input').value
  if(!(doc==="")){
  const name = {
    name: doc
  }
  console.log(JSON.stringify(name))
  fetch('/api/schedules/', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(name)
  }).then(function(response) {
     
        response.json().then((data)=>{
        document.getElementById('create-schedule-span').innerText=(`${data.message}`)
        }
        )
        .catch((err)=>{
          console.log(err)
        })
        
      
  })
  .catch((err)=>{
    console.log(err)
  })
}
else{
  document.getElementById('create-schedule-span').innerText=`Schedule name cannot be empty`
}
}
document.getElementById('create-schedule-btn').addEventListener('click',createSchedule)

//Schedule view
const viewSchedule = () => {
  fetch('/api/schedules/').then(res => 
    res.json().then(
      (data)=>{
        if(res.status===200)
      {  let element = document.getElementById('view-schedule-list')

          // Remove childs
        while (element.hasChildNodes()) {  
          element.removeChild(element.firstChild);
        }
       
        data.map((a)=>{
         let schedule = document.createElement('li') 
         schedule.setAttribute('id',`${a.id}`)  
         schedule.appendChild(document.createTextNode(`Name: ${a.name}, Number of Courses Stored: ${a.number_of_courses} `))
         element.appendChild(schedule)
        })
      }
      else{
        let element = document.getElementById('view-schedule-list')

          // Remove childs
        while (element.hasChildNodes()) {  
          element.removeChild(element.firstChild);
        }
        let schedule = document.createElement('li') 
         schedule.setAttribute('id',`${322132}`)  
         schedule.appendChild(document.createTextNode(`${data.message}`))
         element.appendChild(schedule)
      }
    }
    )
    .catch((err)=>{
      console.log(err)
    })
   
  )
  .catch((err)=>{
    console.log(err)
  })
}
document.getElementById('view-schedule-btn').addEventListener('click',viewSchedule)


let deleteSchedule= (param)=>{
if(param===1){
  const id=document.getElementById('delete-a-schedule-input').value
  console.log(`DELETE ${id}`)
  fetch('/api/schedules/'+id, {
    method: 'DELETE',
    
  }).then(function(response) {
     
        response.json().then((data)=>{
        document.getElementById('delete-a-schedule-span').innerText=(`${data.message}`)
        }
        )
        .catch((err)=>{
          console.log(err)
        })
        
      
  })
  .catch((err)=>{
    console.log(err)
  })
}
else if(param===2){
  
    
    fetch('/api/schedules/schedules/'+7692, {
      method: 'DELETE',
      
    }).then(function(response) {
       
          response.json().then((data)=>{
          document.getElementById('delete-schedule-span').innerText=(`${data.message}`)
          }
          )
          .catch((err)=>{
            console.log(err)
          })
          
        
    })
    .catch((err)=>{
      console.log(err)
    })
  
}
}

document.getElementById('delete-a-schedule-btn').addEventListener('click',()=>{
  deleteSchedule(1)
})
document.getElementById('delete-schedule-btn').addEventListener('click',()=>{
  deleteSchedule(2)
})


const viewCourses = () => {
  fetch('/api/courses').then(res => 
    res.json().then(
      (data)=>{
        let element = document.getElementById('view-courses-list')
        element.style.display=""
          // Remove childs
        while (element.hasChildNodes()) {  
          element.removeChild(element.firstChild);
        }
       
        data.map((a,index)=>{
         let schedule = document.createElement('li') 
         schedule.setAttribute('id',`${index}`)
         let scode= document.createElement('b')
         scode.appendChild(document.createTextNode(`Subject Code: ${a.subject}`))
         //scode.style.color= "blue"
         schedule.appendChild(scode)
         let desc = document.createElement('p')
         desc.appendChild(document.createTextNode(` Description: ${a.className} `))
         schedule.appendChild(desc)
         element.appendChild(schedule)
        })
      }
    )
    .catch((err)=>{
      console.log(err)
    })
   
  )
  .catch((err)=>{
    console.log(err)
  })
}
document.getElementById('view-courses-btn').addEventListener('click',viewCourses)
const hideCourse=() =>{
  let x=document.getElementById('view-courses-list')
  x.style.display="none"
}
document.getElementById('hide-courses-btn').addEventListener('click',hideCourse)


const viewCoursesCodes = () => {
  const id=document.getElementById('view-courses-code-input').value.toUpperCase()
  if(id!==""){
  fetch('/api/courses/'+id).then(res => {
    if(res.status===200){
    res.json().then(
      (data)=>{
        let element = document.getElementById('view-courses-code-list')
        element.style.display=""
          // Remove childs
        while (element.hasChildNodes()) {  
          element.removeChild(element.firstChild);
        }
       
        data.map((a,index)=>{
          let schedule = document.createElement('li') 
          schedule.setAttribute('id',`${index}`)  
          schedule.appendChild(document.createTextNode(`${a}`))
          element.appendChild(schedule)
        })
      }
    )
    .catch((err)=>{
      console.log(err)
    })
  }
  else{
    res.json().then( (data)=>{
    let element = document.getElementById('view-courses-code-list')
    element.style.display=""
    while (element.hasChildNodes()) {  
      element.removeChild(element.firstChild);
    }
    let schedule = document.createElement('b') 
    schedule.appendChild(document.createTextNode(`${data.message}. Check your input!`))
    element.appendChild(schedule)
    

  })
}
  }
  )
  .catch((err)=>{
    console.log(err)
  })
}
else{
    let element = document.getElementById('view-courses-code-list')
    element.style.display=""
    while (element.hasChildNodes()) {  
      element.removeChild(element.firstChild);
    }
    let schedule = document.createElement('b') 
    schedule.appendChild(document.createTextNode(`The Subject Code cannot be empty!`))
    element.appendChild(schedule)
}
}
document.getElementById('view-courses-code-btn').addEventListener('click',viewCoursesCodes)
const hideCourseCodes=() =>{
  let x=document.getElementById('view-courses-code-list')
  x.style.display="none"
}
document.getElementById('hide-courses-code-btn').addEventListener('click',hideCourseCodes)

const viewTimeTable = () => {
  const subject=document.getElementById('view-timetable-subject-input').value.toUpperCase()
  const courseCode = document.getElementById('view-timetable-coursecode-input').value.toUpperCase()
  const component = document.getElementById('view-timetable-component-select').value.toUpperCase()
  if(subject!==""&&courseCode!==""){
  let uri='/api/courses/'+subject+'/'+courseCode+'/'
  if(component) uri = uri+component
  console.log(uri)
  fetch(uri).then(res => {
    if(res.status===200){
    res.json().then(
      (data)=>{
        let element = document.getElementById('view-timetable-div')
        element.style.display=""
          // Remove childs
        while (element.hasChildNodes()) {  
          element.removeChild(element.firstChild);
        }
        console.log(data)
        data.map((a,index)=>{
          let schedule = document.createElement('li') 
          if(a.ssr_component==="LAB") schedule.setAttribute('class','lab-comp')
          else if(a.ssr_component==="LEC") schedule.setAttribute('class','lec-comp')
          else  schedule.setAttribute('class','tut-comp')
          schedule.setAttribute('id',`${index}`)
          schedule.appendChild(document.createTextNode(`
          Class Number: ${a.class_nbr}
          Duration: ${a.start_time} - ${a.end_time}
          Component: ${a.ssr_component}
          Days: ${a.days}
          Class Section: ${a.class_section}
          Description: ${a.descr}
          `))
          element.appendChild(schedule)
        })
      }
    )
    .catch((err)=>{
      console.log(err)
    })
  }

  
  else{
    res.json().then( (data)=>{
    let element = document.getElementById('view-timetable-div')
    element.style.display=""
    while (element.hasChildNodes()) {  
      element.removeChild(element.firstChild);
    }
    let schedule = document.createElement('b') 
    schedule.appendChild(document.createTextNode(`${data.message}. Check your input!`))
    element.appendChild(schedule)
    

  })
}
  }
  )
  .catch((err)=>{
    console.log(err)
  })
}
else if (subject===""&&courseCode===""){
    let element = document.getElementById('view-timetable-div')
    element.style.display=""
    while (element.hasChildNodes()) {  
      element.removeChild(element.firstChild);
    }
    let schedule = document.createElement('b') 
    schedule.appendChild(document.createTextNode(`Subject Code and Course Code cannot be empty`))
    element.appendChild(schedule)
}
else if (subject===""){
  let element = document.getElementById('view-timetable-div')
  element.style.display=""
  while (element.hasChildNodes()) {  
    element.removeChild(element.firstChild);
  }
  let schedule = document.createElement('b') 
  schedule.appendChild(document.createTextNode(`Subject Code cannot be empty`))
  element.appendChild(schedule)
}
else{
  let element = document.getElementById('view-timetable-div')
  element.style.display=""
  while (element.hasChildNodes()) {  
    element.removeChild(element.firstChild);
  }
  let schedule = document.createElement('b') 
  schedule.appendChild(document.createTextNode(`Course Code cannot be empty`))
  element.appendChild(schedule)
}
}


document.getElementById('view-timetable-btn').addEventListener('click',viewTimeTable)
const hideTimeTable=() =>{
 let x=document.getElementById('view-timetable-div')
   x.style.display="none"
 }
 document.getElementById('hide-timetable-btn').addEventListener('click',hideTimeTable)


 const addToSchedule=()=>{
 let names=document.getElementById('add-pairs-schedulename-input').value
  let name = [{
    name: document.getElementById('add-pairs-schedulename-input').value,
    subjectCode: document.getElementById('add-pairs-subject-input').value,
    courseCode: document.getElementById('add-pairs-coursecode-input').value
  }]
  let values=[]

  let li =document.querySelectorAll(".subjectClass")
  //console.log(li)
  let bi =document.querySelectorAll(".courseClass")
  //console.log(bi)
  console.log(names)
  li.forEach((a,index)=>{
    // console.log(a.value)
    // console.log(bi[index].value)
    if(a.value!=='' && bi[index].value!==''){
    let y={
      name: names,
      subjectCode: a.value,
      courseCode:bi[index].value
    }
    // console.log(y)
    values.push(y)
  }
  })

  console.log(JSON.stringify(values))
  if(values.length!==0)
{  fetch('/api/schedules/courses/', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(values)
  }).then(function(response) {
      
        response.json().then((data)=>{
        document.getElementById('add-pairs-span').innerText=(`${data.message}`)
        }
        )
        .catch((err)=>{
          console.log(err)
        })
        
      
  })
  .catch((err)=>{
    console.log(err)
  })}
}
document.getElementById('add-pairs-savebtn').addEventListener('click',addToSchedule)

let addMoreFields=()=>{
  let element = document.getElementById('add-pairs-section')
  let pairDiv = document.createElement('div')
  let pairInput1=document.createElement('input')
  let label1=document.createElement('label')
  label1.appendChild(document.createTextNode('Enter Subject Code: '))
  let label2=document.createElement('label')
  label2.appendChild(document.createTextNode(' Enter Course Code: '))
  pairInput1.setAttribute("class","subjectClass")
  let pairInput2=document.createElement('input')
  pairInput2.setAttribute("class","courseClass")
  pairDiv.appendChild(label1)
  pairDiv.appendChild(pairInput1)
  pairDiv.appendChild(label2)
  pairDiv.appendChild(pairInput2)
  element.appendChild(pairDiv)
}

document.getElementById('add-pairs-btn').addEventListener('click',addMoreFields)

let removeC=()=>{
  let selectelement = document.getElementById('add-pairs-section');
  selectelement.removeChild(selectelement.lastChild);


}

document.getElementById('remove-pairs-btn').addEventListener('click',removeC)

let viewTimeTableStored = (e) => {
  
  console.log(e.target.id)
  let iiD=e.target.id
  let elementText = document.getElementById(`${iiD}`).textContent;
  let splitText=elementText.split(",");
  let a=splitText[0].split('Subject: ')
  let subject_=a[1].replace(/\s/g, "")
  console.log(subject_)
  let b=splitText[1].split('Course Code: ')
  let course_=b[1].replace(/\s/g, "")
  console.log(course_)
  let element = document.getElementById('view-stored-ul')
  if(element.style.display==="none")
  {fetch('/api/courses/'+subject_+'/'+course_+'/').then(res => {
    if(res.status===200){
    res.json().then(
      (data)=>{
        
        element.style.display=""
          // Remove childs
        while (element.hasChildNodes()) {  
          element.removeChild(element.firstChild);
        }
        console.log(data)
        let scheduleText = document.createElement('p') 
        scheduleText.appendChild(document.createTextNode('Course Timetable:'))
        element.appendChild(scheduleText)
        data.map((a,index)=>{
          
          let schedule = document.createElement('li') 
          if(a.ssr_component==="LAB") schedule.setAttribute('class','lab-comp')
          else if(a.ssr_component==="LEC") schedule.setAttribute('class','lec-comp')
          else  schedule.setAttribute('class','tut-comp')
          schedule.setAttribute('id',`${index}`)
          schedule.appendChild(document.createTextNode(`
          Class Number: ${a.class_nbr}
          Duration: ${a.start_time} - ${a.end_time}
          Component: ${a.ssr_component}
          Days: ${a.days}
          Class Section: ${a.class_section}
          Description: ${a.descr}
          `))
          
          element.appendChild(schedule)
        })
      }
    )
    .catch((err)=>{
      console.log(err)
    })
  }
})}
else{
  element.style.display="none"
}
}




const viewScheduleInformation = () => {
  let name = document.getElementById('view-schedule-information-name-input').value
  if(!(name==="")){
  fetch('/api/schedules/'+name).then(res => {
   
    res.json().then(
      (data)=>{
        if(res.status===200){
        let element = document.getElementById('view-schedule-information-list')

          // Remove childs
        while (element.hasChildNodes()) {  
          element.removeChild(element.firstChild);
        }
       
        data.map((a)=>{
         let scheduleLink = document.createElement('a')
         scheduleLink.setAttribute('class', 'courseViewLink')
         
         let schedule = document.createElement('li') 
         const valueID = Math.floor(Math.random() * 10)+a.id;
         scheduleLink.setAttribute('id',`${valueID+1}e`)
         schedule.setAttribute('id',`${valueID}e`)  
         schedule.appendChild(document.createTextNode(`Subject: ${a.subjectCode}, Course Code: ${a.courseCode} `))
        
        
         
         
         scheduleLink.appendChild(schedule)
         
         element.appendChild(scheduleLink)
         scheduleLink.addEventListener('click',(e)=>{
         viewTimeTableStored(e)
         })

         
        })
        let innerUL=document.createElement(`ul`)
        innerUL.setAttribute('id','view-stored-ul')
        innerUL.style.display="none"
        element.appendChild(innerUL)
      }
      
    else{
      let element = document.getElementById('view-schedule-information-list')
      while (element.hasChildNodes()) {  
        element.removeChild(element.firstChild);
      }
      let schedule = document.createElement('li') 
      schedule.setAttribute('id',`2200`)  
      schedule.appendChild(document.createTextNode(`${data.message}`))
      element.appendChild(schedule)
    }
  }
    )
    .catch((err)=>{
      console.log(err)
    })
  

  })
  .catch((err)=>{
    console.log(err)
  })
}
else{
  let element = document.getElementById('view-schedule-information-list')
  while (element.hasChildNodes()) {  
    element.removeChild(element.firstChild);
  }
  let schedule = document.createElement('li') 
  schedule.setAttribute('id',`2200`)  
  schedule.appendChild(document.createTextNode(`Schedule name is empty`))
  element.appendChild(schedule)

}
}
document.getElementById('view-schedule-information-savebtn').addEventListener('click',viewScheduleInformation)









let inputValidator=(textbox, inputFilter)=> {
  ["input", "keydown", "keyup"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}

// inputValidator(document.getElementById("spotlight2"), function(value) {
//   return /^-?\d*$/.test(value); });
let x =document.querySelectorAll(".subjectClass")
x.forEach((a)=>{
inputValidator(a, function(value) {
  return /^[A-Za-z]*$/i.test(value); });
})


inputValidator(document.getElementById("view-timetable-subject-input"), function(value) {
  return /^[A-Za-z]*$/i.test(value); });