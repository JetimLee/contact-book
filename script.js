/***************************************************
 * Simple in-browser contact manager using localStorage
 ****************************************************/

const STORAGE_KEY = "contactsAddressBook";

let contacts = []; // Array to store contacts
let currentContact = null; // The contact currently being edited/viewed

// DOM Elements
const contactsListEl = document.getElementById("contactsList");
const formTitleEl = document.getElementById("formTitle");
const contactFormEl = document.getElementById("contactForm");
const firstNameEl = document.getElementById("firstName");
const lastNameEl = document.getElementById("lastName");
const emailListEl = document.getElementById("emailList");
const addEmailBtn = document.getElementById("addEmailBtn");
const deleteBtn = document.getElementById("deleteBtn");
const addNewContactBtn = document.getElementById("addNewContactBtn");

// ---- Load contacts from localStorage ----
function loadContactsFromStorage() {
  const json = localStorage.getItem(STORAGE_KEY);
  contacts = json ? JSON.parse(json) : [];
}

// ---- Save contacts to localStorage ----
function saveContactsToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

// ---- Render the list of contacts on the left side ----
function renderContactsList() {
  contactsListEl.innerHTML = "";
  contacts.forEach((contact) => {
    const li = document.createElement("li");
    li.textContent = `${contact.firstName} ${contact.lastName}`;
    li.addEventListener("click", () => selectContact(contact.id));
    contactsListEl.appendChild(li);
  });
}

// ---- Select a contact by ID and populate the form ----
function selectContact(contactId) {
  currentContact = contacts.find((c) => c.id === contactId);
  if (!currentContact) return;

  // Populate form fields
  firstNameEl.value = currentContact.firstName;
  lastNameEl.value = currentContact.lastName;
  renderEmailList(currentContact.emails);

  formTitleEl.textContent = `Editing: ${currentContact.firstName} ${currentContact.lastName}`;
  deleteBtn.style.display = "inline-block"; // Show the delete button
}

// ---- Render the email list in the form ----
function renderEmailList(emails) {
  emailListEl.innerHTML = "";
  emails.forEach((email, index) => {
    const li = document.createElement("li");
    li.classList.add("email-item");

    const span = document.createElement("span");
    span.textContent = email;

    const del = document.createElement("span");
    del.textContent = "×";
    del.classList.add("delete-email");
    del.addEventListener("click", () => {
      currentContact.emails.splice(index, 1);
      renderEmailList(currentContact.emails);
    });

    li.appendChild(span);
    li.appendChild(del);
    emailListEl.appendChild(li);
  });
}

// ---- Handler for adding a new email ----
function addEmail() {
  if (!currentContact) {
    alert("Please create or select a contact before adding emails.");
    return;
  }
  const email = prompt("Enter a new email:");
  if (email) {
    currentContact.emails.push(email);
    renderEmailList(currentContact.emails);
  }
}

// ---- Handler for saving a contact ----
function handleSaveContact(event) {
  event.preventDefault();

  // Validate required fields
  const firstName = firstNameEl.value.trim();
  const lastName = lastNameEl.value.trim();
  if (!firstName || !lastName) {
    alert("First Name and Last Name are required.");
    return;
  }

  // Create a new contact if none is selected, or update the existing one
  if (!currentContact) {
    const newId = Date.now(); // Simple unique ID
    const newContact = {
      id: newId,
      firstName,
      lastName,
      emails: [],
    };
    contacts.push(newContact);
    currentContact = newContact;
  } else {
    currentContact.firstName = firstName;
    currentContact.lastName = lastName;
  }

  saveContactsToStorage();
  renderContactsList();
  formTitleEl.textContent = `Editing: ${currentContact.firstName} ${currentContact.lastName}`;
  alert("Contact saved!");
}

// ---- Handler for deleting a contact ----
function handleDeleteContact() {
  if (!currentContact) return;
  if (
    !confirm(`Delete ${currentContact.firstName} ${currentContact.lastName}?`)
  )
    return;
  contacts = contacts.filter((c) => c.id !== currentContact.id);
  currentContact = null;
  saveContactsToStorage();
  renderContactsList();
  clearForm();
}

// ---- Clear the form fields and reset the title ----
function clearForm() {
  contactFormEl.reset();
  formTitleEl.textContent = "No Contact Selected";
  emailListEl.innerHTML = "";
  deleteBtn.style.display = "none";
}

// ---- Handler for the "Add New Contact" button ----
function handleAddNewContact() {
  clearForm();
  currentContact = null;
  formTitleEl.textContent = "Add New Contact";
}

// --------------------------------------------------
// Initialization
// --------------------------------------------------
function init() {
  loadContactsFromStorage();
  renderContactsList();

  // Set up event listeners
  contactFormEl.addEventListener("submit", handleSaveContact);
  addEmailBtn.addEventListener("click", addEmail);
  deleteBtn.addEventListener("click", handleDeleteContact);
  addNewContactBtn.addEventListener("click", handleAddNewContact);
}

// Ensure the DOM is fully loaded before initializing
document.addEventListener("DOMContentLoaded", init);
