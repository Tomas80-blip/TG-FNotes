const fetchUrl = "https://testapi.io/api/Tomas/resource/NoteList";
const form = document.querySelector("#notesForm");

fetch("https://testapi.io/api/Tomas/resource/NoteList")
  .then((response) => response.json())
  // .then((data) => console.log(data))
  .then((data) => console.log(data.data)) //kad gauti savo sukurtus elementus

// f. pasiima duomenis is serverio
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
// f. gauti duomenis (data) is serverio ir atvaizduoti
const getAndRenderNotes = async () => {
  const notesList = document.querySelector("#notes");
  notesList.innerHTML = "";

    const data = await fetchAPI(fetchUrl);
    if (data?.data?.length) renderNotes(data.data);
};

// f. atvaizduoti notes HTML'e
const renderNotes = (notes) => {
  const notesList = document.querySelector("#notes");
  notes.forEach((note) => {
    const noteItem = createNoteElement(note);
    notesList.appendChild(noteItem);
  });
};
//f. sukurti viena note
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

  // delete mygtukas idedamas i div'o konteineri
  actionsContainer.append(deleteButton);

  //div'as su class'e "noteItem__text" ir div'as su class'e "noteItem__actions" sudedami i note
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

// f. atnaujinti duomenis serveryje
const handleUpdate = async (note, updatedFields) => {
  
  await fetchAPI(`${fetchUrl}/${note.id}`, "PUT", {
    ...note,
    ...updatedFields,
  });
  getAndRenderNotes();

};
//f. isvalyti forma
const clearForm = () => {
  document.querySelector("#title").value = "";
  document.querySelector("#description").value = "";
};

// f. prideti event listeneri prie submit
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  //sukuriamas naujas objektas
  const newNote = {
    title: document.querySelector("#title").value,
    description: document.querySelector("#description").value,  
  };
  // duomenys siunciami i serveri kaip naujas objektas
    await fetchAPI(fetchUrl, "POST", newNote);
    //isvalomi f. laukeliai
    clearForm();
    //f. gauna data is serverio ir atvaizduoja
    getAndRenderNotes(); 
});
// f. kvieciama antra karta kad notes butu parodytus iskart, uzsikrovus puslapiui
getAndRenderNotes();