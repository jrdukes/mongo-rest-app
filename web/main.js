// Use of IIFE
// immediately invoked function expression

// testing code from https://github.com/AnnaCate/jrs-mongo-rest to get CRUD functions to work.

// original code:

// const page = {
// 	init: function() {
// 		page
// 			.getStudents()
// 			.then(function(students) {
// 				console.log('STUDENTS', students)
// 				page.addStudentsToPage(students.data)
// 			})
// 			.then(function() {
// 				page.initEvents()
// 			})
// 	},
// 	initEvents: function() {
// 		// setTimeout(function() {
// 		page.clickDetails()
// 		page.deleteStudentEvent()
// 		// }, 2000)
// 	},
// 	clickDetails: function() {
// 		document.addEventListener('click', function(event) {
// 			event.preventDefault()
// 			const data = event.target.dataset
// 			console.log(data.id)
// 			const isMoreDetail = event.target.classList.contains('detailLink')
// 			if (isMoreDetail) {
// 				page.getSingleStudent(data.id).then(function(student) {
// 					console.log('we are getting our student', student)
// 				})
// 			}
// 		})
// 	},
// 	getSingleStudent: function(studentId) {
// 		return fetch(`http://localhost:8000/students/${studentId}`).then(function(student) {
// 			return student.json()
// 		})
// 	},
// 	deleteStudentEvent: function() {
// 		const $deleteLinks = document.querySelectorAll('.deleteLink')
// 		console.log('hello links', $deleteLinks)
// 		$deleteLinks.forEach(function(deleteLinkDom) {
// 			deleteLinkDom.addEventListener('click', function(event) {
// 				event.preventDefault()
// 				const data = event.target.dataset
// 				const isDeleteLink = event.target.classList.contains('deleteLink')
// 				if (isDeleteLink) {
// 					page.deleteStudentFromApi(data.id)
// 				}
// 				console.log(data.id)
// 			})
// 		})
// 	},
// 	deleteStudentFromApi: function(studentId) {
// 		return fetch(`http://localhost:8000/students/${studentId}`, {
// 			method: 'DELETE'
// 		}).then(function(res) {
// 			return res.json()
// 		})
// 	},
// 	getStudents: function() {
// 		return fetch('http://localhost:8000/students')
// 			.then(function(students) {
// 				return students.json()
// 			})
// 			.catch((error) => console.log('Error', error))
// 	},
// 	addStudentsToPage: function(students) {
// 		let html = '<ul>'
// 		students.forEach(function(student) {
// 			html += `<li>${page.singleStudentTemplate(student)}</li>`
// 		})
// 		html += '</ul>'
// 		const $studentsList = document.querySelector('#studentsList')
// 		$studentsList.innerHTML = html
// 		console.log(html)
// 	},
// 	singleStudentTemplate: function(student) {
// 		return `<div data-id="${student._id}">
//         <h3>${student.name}</h3>
//         <img src="${student.photoUrl}">
//         <p>${student.bio}</p>
//         <a class="detailLink" href="#" data-id="${student._id}">More Details</a>
//         <a class="deleteLink" href="#" data-id="${student._id}">Delete student</a>
//         </div>`
// 	}
// }
// ;(function() {
// 	page.init()
// })()

const page = {
  init: () => {
    page
      .getStudents()
      .then(students => page.addStudentsToPage(students.data))
      .then(() => page.initEvents())
      .then(() => page.addNewStudent());
  },
  initEvents: () => {
    page.clickDetails();
    page.clickEdit();
    page.deleteStudentEvent();
  },
  addNewStudent: () => {
    document.querySelector('#add-new').addEventListener('click', () => {
      page.createModal();
      page.populateAddModal();
      document.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.id === 'submit' && name.value !== null) {
          const name = document.querySelector('#name');
          const age = document.querySelector('#age');
          const photoUrl = document.querySelector('#photoUrl');
          const bio = document.querySelector('#bio');

          return fetch('http://localhost:8000/students', {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              name: name.value,
              age: age.value,
              photoUrl: photoUrl.value,
              bio: bio.value
            })
          })
            .then(res => res.json())
            .then(res => page.addSingleStudentToPage(res.newStudent))
            .finally(() => {
              // clear input values
              document.querySelector('#name').value = '';
              document.querySelector('#age').value = '';
              document.querySelector('#photoUrl').value = '';
              document.querySelector('#bio').value = '';
              // close modal
              page.removeModal();
            });
        }
      });
    });
  },
  addSingleStudentToPage: student => {
    const ul = document.querySelector('#studentsList > ul');
    const li = document.createElement('li');
    li.classList.add('studentLi');
    li.innerHTML = `${page.singleStudentTemplate(student)}`;
    ul.appendChild(li);

    // add event listeners to delete link
    const links = li.querySelector('.container-links');
    links.addEventListener('click', e => {
      if (e.target.classList.contains('deleteLink')) {
        page.deleteStudentFromApi(e.target.dataset.id).then(res => {
          page.deleteSingleStudentFromPage(res.res);
        });
      }
    });
  },
  addStudentsToPage: students => {
    let html = '<ul>';
    students.forEach(student => {
      html += `<li class="studentLi">${page.singleStudentTemplate(
        student
      )}</li>`;
    });
    html += '</ul>';
    const $studentsList = document.querySelector('#studentsList');
    $studentsList.innerHTML = html;
  },
  clickDetails: () => {
    document.addEventListener('click', e => {
      e.preventDefault();
      if (e.target.classList.contains('detailLink')) {
        page.createModal();
        page
          .getSingleStudent(e.target.dataset.id)
          .then(page.populateDetailsModal);
      }
    });
  },
  clickEdit: () => {
    document.addEventListener('click', e => {
      e.preventDefault();
      if (e.target.classList.contains('editLink')) {
        page.createModal();
        page.getSingleStudent(e.target.dataset.id).then(page.populateEditModal);
      }
    });
  },
  createModal: () => {
    // create modal
    const main = document.querySelector('main');
    const modalContainer = document.createElement('section');
    modalContainer.classList.add('modal-container');
    main.appendChild(modalContainer);

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modalContainer.appendChild(modal);

    // create close button
    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('id', 'modal-close-btn');
    btn.setAttribute('class', 'modal-close-btn');
    btn.innerHTML = '<strong>X</strong>';
    modal.appendChild(btn);
    btn.addEventListener('click', () => {
      page.removeModal();
    });
  },
  deleteStudentEvent: () => {
    const $deleteLinks = document.querySelectorAll('.deleteLink');
    $deleteLinks.forEach(deleteLinkDom => {
      deleteLinkDom.addEventListener('click', e => {
        e.preventDefault();
        const data = e.target.dataset;
        const isDeleteLink = e.target.classList.contains('deleteLink');
        if (isDeleteLink) {
          page.deleteStudentFromApi(data.id).then(res => {
            page.deleteSingleStudentFromPage(res.res);
          });
        }
      });
    });
  },
  deleteStudentFromApi: studentId => {
    return fetch(`http://localhost:8000/students/${studentId}`, {
      method: 'DELETE'
    }).then(res => {
      return res.json();
    });
  },
  deleteSingleStudentFromPage: studentId => {
    if (document.querySelector(`[data-id="${studentId}"]`)) {
      const studentDiv = document.querySelector(`[data-id="${studentId}"]`);
      const studentLi = studentDiv.parentNode;
      studentLi.parentNode.removeChild(studentLi);
    }
  },
  getSingleStudent: studentId => {
    return fetch(`http://localhost:8000/students/${studentId}`).then(student =>
      student.json()
    );
  },
  getStudents: () => {
    return fetch('http://localhost:8000/students')
      .then(students => students.json())
      .catch(err => console.error(`Error: ${err}`));
  },
  populateAddModal: () => {
    const modal = document.querySelector('.modal');

    // add form to modal
    const formDiv = document.createElement('div');
    formDiv.classList.add('add-student-form');
    modal.appendChild(formDiv);
    formDiv.innerHTML = `<form>
				<input id="name" type="text" name="name" placeholder="Name" />
				<input id="age" type="text" name="age" placeholder="Age" />
				<input
				  id="photoUrl"
				  type="text"
				  name="photoUrl"
				  placeholder="Photo URL"
				/>
				<textarea cols="26" wrap="hard" id="bio" name="bio" placeholder="Bio"></textarea>
				<input id="submit" type="submit" value="Submit" />
			  </form>`;
  },
  populateDetailsModal: student => {
    const modal = document.querySelector('.modal');

    // populate modal
    const modalInfo = document.createElement('div');
    modalInfo.classList.add('modal-info-container');
    modal.appendChild(modalInfo);
    const photoUrl = student.photoUrl
      ? student.photoUrl
      : 'http://www.reshef-group.co.il/wp-content/uploads/2016/09/empty-person-image-300x300.jpg';
    const age = student.age ? student.age : ' ';
    const bio = student.bio ? student.bio : ' ';
    modalInfo.innerHTML = `<img class="modal-img"
		src=${photoUrl} alt="profile picture">
		<h3 id="name" class="modal-name cap">${student.name}</h3>
		<p class="modal-text">Age: ${age}</p>
		<hr>
		<p class="modal-text cap">${bio}</p>
	  `;
  },
  populateEditModal: student => {
    // page.createModal();
    const modal = document.querySelector('.modal');

    // add form to modal
    const formDiv = document.createElement('div');
    formDiv.classList.add('edit-student-form');
    modal.appendChild(formDiv);
    formDiv.innerHTML = `<form>
				<input id="name-edit" type="text" name="name" placeholder="Name" />
				<input id="age-edit" type="text" name="age" placeholder="Age" />
				<input
				  id="photoUrl-edit"
				  type="text"
				  name="photoUrl"
				  placeholder="Photo URL"
				/>
				<textarea id="bio-edit" name="bio" placeholder="Bio"></textarea>
				<input id="submit-edit" type="submit" value="Update student" />
			  </form>`;
    const name = document.querySelector('#name-edit');
    name.value = student.name;
    const age = document.querySelector('#age-edit');
    age.value = student.age;
    const photoUrl = document.querySelector('#photoUrl-edit');
    photoUrl.value = student.photoUrl;
    const bio = document.querySelector('#bio-edit');
    bio.value = student.bio;

    // add event listener to submit button
    const submitBtn = document.querySelector('#submit-edit');
    submitBtn.addEventListener('click', e => {
      page
        .updateStudentInApi(student._id)
        .then(page.updateStudentOnPage)
        .finally(page.removeModal());
    });
  },
  removeModal: () => {
    const main = document.querySelector('main');
    const modalContainer = document.querySelector('.modal-container');
    main.removeChild(modalContainer);
  },
  singleStudentTemplate: student => {
    const photoUrl = student.photoUrl
      ? student.photoUrl
      : 'http://www.reshef-group.co.il/wp-content/uploads/2016/09/empty-person-image-300x300.jpg';
    return `<div data-id="${student._id}">
		  <div class="info-div">
			<h3>${student.name}</h3>
			<img src="${photoUrl}">
			<p>${student.bio}</p>
		  </div>
				  <div class="container-links">
			<a class="detailLink" href="#" data-id="${student._id}">See details</a> 
			<a class="editLink" href="#" data-id="${student._id}">Edit</a>
			<a class="deleteLink" href="#" data-id="${student._id}">Delete</a>
				  </div>
		  </div>`;
  },
  updateStudentInApi: studentId => {
    const name = document.querySelector('#name-edit').value;
    const age = document.querySelector('#age-edit').value;
    const photoUrl = document.querySelector('#photoUrl-edit').value;
    const bio = document.querySelector('#bio-edit').value;

    return fetch(`http://localhost:8000/students/${studentId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        age: age,
        photoUrl: photoUrl,
        bio: bio
      })
    }).then(res => res.json());
  },
  updateStudentOnPage: student => {
    const studentDiv = document.querySelector(`[data-id="${student._id}"]`);
    const photoUrl = student.photoUrl
      ? student.photoUrl
      : 'http://www.reshef-group.co.il/wp-content/uploads/2016/09/empty-person-image-300x300.jpg';
    studentDiv.firstElementChild.innerHTML = `<h3>${student.name}</h3>
	  <img src="${photoUrl}">
	  <p>${student.bio}</p>`;
  }
};

(() => page.init())();
