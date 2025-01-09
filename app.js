const fetchUrl = "https://testapi.io/api/Tomas/resource/NoteList";
const form = document.querySelector("#notesForm");

fetch("https://testapi.io/api/Tomas/resource/NoteList")
  .then((response) => response.json())  
  .then((data) => console.log(data.data))


const fetchAPI = async (url, method = "GET", body = null) => {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  if (method === "DELETE") return;
  return await response.json();
};

const getAndRenderNotes = async () => {
  const notesList = document.querySelector("#notes");
  notesList.innerHTML = "";

    const data = await fetchAPI(fetchUrl);
    if (data?.data?.length) renderNotes(data.data);
};


const renderNotes = (notes) => {
  const notesList = document.querySelector("#notes");
  notes.forEach((note) => {
    const noteItem = createNoteElement(note);
    notesList.appendChild(noteItem);
  });
};

const createNoteElement = (note) => {
  const noteItem = document.createElement("div");
  noteItem.id = note.id;
  noteItem.classList.add("noteItem");

  const textContainer = document.createElement("div");
  textContainer.classList.add("noteItem__text");

  const title = document.createElement("h3");
  title.textContent = note.title;

  const description = document.createElement("p");
  description.textContent = note.description;
  
  description.classList.toggle("completed", note.completed);  
  description.addEventListener("click", () => {
    description.classList.toggle("completed");    
    handleUpdate(note, { completed: description.classList.contains("completed") });
  });
  
  textContainer.append(title, description);
  
  const actionsContainer = document.createElement("div");
  actionsContainer.classList.add("noteItem__actions");
  
  const deleteButton = createButton("🗑️", () => handleDelete(note.id));  
  deleteButton.classList.add("delete");  
  actionsContainer.append(deleteButton);
  
  noteItem.append(textContainer, actionsContainer);
  return noteItem;
};

const createButton = (text, onClick) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
};

const handleDelete = async (id) => {  
  await fetchAPI(`${fetchUrl}/${id}`, "DELETE");
  getAndRenderNotes();
 
};

const handleUpdate = async (note, updatedFields) => {
  
  await fetchAPI(`${fetchUrl}/${note.id}`, "PUT", {
    ...note,
    ...updatedFields,
  });
  getAndRenderNotes();

};

const clearForm = () => {
  document.querySelector("#title").value = "";
  document.querySelector("#description").value = "";
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();  
  const newNote = {
    title: document.querySelector("#title").value,
    description: document.querySelector("#description").value,  
  };  
    await fetchAPI(fetchUrl, "POST", newNote);    
    clearForm();    
    getAndRenderNotes(); 
});

getAndRenderNotes();