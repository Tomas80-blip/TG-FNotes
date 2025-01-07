const fetchUrl = "https://testapi.io/api/Tomas/resource/NoteList";

fetch("https://testapi.io/api/Tomas/resource/NoteList")
  .then((response) => response.json())
  // .then((data) => console.log(data))
  .then((data) => console.log(data.data)) //kad gauti savo sukurtus elementus

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
  try {
    const data = await fetchAPI(fetchUrl);
    if (data?.data?.length) renderNotes(data.data);
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
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
// sukuriamas div'as su class'e "noteItem__text" ir h3, p elementais
  const textContainer = document.createElement("div");
  textContainer.classList.add("noteItem__text");

  const title = document.createElement("h3");
  title.textContent = note.title;

  const description = document.createElement("p");
  description.textContent = note.description;

  // Pridedama arba pašalinama CSS klasė "completed" (užbraukimas)
  description.classList.toggle("completed", note.completed);
  // Pridedamas "Click" liseneris
  description.addEventListener("click", () => {
    description.classList.toggle("completed");
     // Atnaujinama užduoties būsena pagal tai, ar klasė "completed" yra priskirta (uzbraukiama)
    handleUpdate(note, { completed: description.classList.contains("completed") });
  });
  // title ir description sudedami i text conteineri 
  textContainer.append(title, description);

  //sukuriamas div'as su class'e "noteItem__actions" 
  const actionsContainer = document.createElement("div");
  actionsContainer.classList.add("noteItem__actions");

  // sukuriamas delete mygtukas su piktograma ir paspaudimo ivykio f.
  const deleteButton = createButton("🗑️", () => handleDelete(note.id));
  // mygtukui pridedama klase "delete"(stilizavimui)
  deleteButton.classList.add("delete");

  actionsContainer.append(deleteButton);

  noteItem.append(textContainer, actionsContainer);
  return noteItem;
};
// mygtuko sukurimo f.
const createButton = (text, onClick) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
};
// paspaudimo ivykio f.
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

document.querySelector("#notesForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const newNote = {
    title: document.querySelector("#title").value,
    description: document.querySelector("#description").value,
    completed: false,
    createdAt: new Date().toISOString(),
  };
    await fetchAPI(fetchUrl, "POST", newNote);
    clearForm();
    getAndRenderNotes(); 
});
getAndRenderNotes();