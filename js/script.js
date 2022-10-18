"use strict";

// CRUD = Create (POST), Read (GET), Update (PUT), Delete (DELETE)

const root = document.querySelector("#root");

const screenBlock = document.createElement("div");
const screenInput = document.createElement("input");
const screenBtnAdd = document.createElement("button");

const listsBlock = document.createElement("div");

screenBlock.id = "screenBlock";
screenInput.type = "text";
screenInput.placeholder = "Type here...";
screenBtnAdd.textContent = "ADD";

listsBlock.id = "listsBlock";

root.prepend(screenBlock);
root.append(listsBlock);
screenBlock.append(screenInput, screenBtnAdd);

const url = "http://localhost:8888/todo/";

root.addEventListener("submit", function (e) {
	e.preventDefault();
	const val = screenInput.value.trim();

	if (val !== "") {
		fetch(url, {
			method: "POST",
			headers: {
				"content-type" : "application/json"
			},
			body: JSON.stringify({title: val})
		});
	}

	this.reset();
});

fetch(url)
.then(data => data.json())
.then(data => {
	data.forEach(todoObj => {
		listsBlock.innerHTML += `
			<div class="listsBlock__item">
				<p>
					<span>${todoObj.id}</span>
					${todoObj.title}
				</p>
				<button data-rm>Delete</button>
			</div>
		`;
	});

	return data;
})
.then(data => {
	const removeBtnsArray = document.querySelectorAll("[data-rm]");

	removeBtnsArray.forEach(btn => {
		btn.addEventListener("click", function () {
			this.parentElement.remove();

			data.forEach(todoObj => {
				const fakeId = this.previousElementSibling.firstElementChild.textContent;

				if (parseInt(fakeId) === todoObj.id) {
					fetch(url+todoObj.id, {
						method: "DELETE",
						headers: {
							"content-type" : "application/json"
						}
					});
				}
			});
		});
	});
    return data;
})
.then(data => {
    data.forEach((todoObj) => {
        document.querySelectorAll("[data-up]").forEach((edit) => {
            edit.addEventListener("click", () => {
                edit.parentElement.innerHTML = `
                    <input type = "text data-input value = "">
                    <button data-end class ="end"></button>
                    <button data-rm>Delete</button>
                `;
                document.querySelectorAll(["data-end"]).forEach(e => {
                    e.addEventListener("click", () => {
                        e.parentElement.innerHTML = `
                            <div>
                                <p>
                                    ${e.previousElementSibling.value}
                                </p>
                                <button data-up>Edit</button>
                                <button data-rm>Delete</button>
                            </div>
                        `;
                    });
                });
                fetch(url + todoObj.id, {
                    method: "PUT",
                    headers: {
                        "content-type" : "application/json"
                    },
                    body: JSON.stringify({"title": document.querySelector("[data-input]").value})
                })
            })
        })
    })
})