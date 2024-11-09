//! duzenleme modu degiskenleri
let editMode = false; // duzenleme modunu b
let editItem; // duzenleme elemanini
let editItemId; // duzenleme elemani id si

// ! html elemanlari cagirma
const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");
const clearButton = document.querySelector(".clear-btn");

// console.log(form, input)
//!! foksiyonlar
/* form gonderildiinge calisacak fonksiyon */
const addItem = (e) => {
  //sayfanin yenilenmesini iptal et
  e.preventDefault();
  const value = input.value;
  if (value !== "" && !editMode) {
    // silme islemleri icin bezersiz degerlere ihtiyacimiz var bunun icin id olusturuk
    const id = new Date().getTime().toString();
    createElement(id, value);
    setToDefault();
    showAlert("Eleman Eklendi", "success");
    addToLocalStorage(id, value);
  } else if (value !== "" && editMode) {
    editItem.innerHTML = value;
    updateLocalStorage(editItemId, value);
    showAlert("Eleman Guncellendi", "success");
    setToDefault();
  }
};

//* uyari veren fonksiyon **/

const showAlert = (text, action) => {
  // alert kisminin icerigini belirle
  alert.textContent = ` ${text} `;
  // alert kismina class ekle
  alert.classList.add(`alert-${action}`);
  // alert kisminin icerigini guncelle ve eklenen class i kaldir
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};

//* elemanlari silen fonksiyon

const deleteItems = (e) => {
  // silinmek istenen elemana eris
  const element = e.target.parentElement.parentElement.parentElement;
  const id = element.dataset.id;
  // bu elemani kaldir
  itemList.removeChild(element);
  removeFromLocalStorage(id);

  showAlert("Eleman silindi", "danger");
  // egerki hic eleman yoksa sifirlama butonunu kaldir
  if (!itemList.children.length) {
    clearButton.style.display = "none";
  }
};

// elemanlari guncelleyen fonksiyon
const editItems = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editItem = e.target.parentElement.parentElement.previousElementSibling;
  input.value = editItem.innerText;
  editMode = true;
  editItemId = element.dataset.id;
  addButton.textContent = "Duzenle";
};

// varsayilan degerlere donen donduren fonksiyon
const setToDefault = () => {
  input.value = "";
  editMode = false;
  editItemId = "";
  addButton.textContent = "Ekle";
};

//*Sayfa yuklendiginde elemanlara render edecek fonksiyon

const renderItems = () => {
  let items = getFromLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => createElement(item.id, item.value));
  }
};

/* eleman olusturan fonksiyon */
function createElement(id, value) {
  // yeni bir olusturma
  const newDiv = document.createElement("div");

  // div e attribute ekle
  newDiv.setAttribute("data-id", id);

  // dive class ekle
  newDiv.classList.add("items-list-item");

  newDiv.innerHTML = `<p class="item-name">${value}</p>
   <div class="btn-container">
     <button class="edit-btn">
       <i class="fa-solid fa-pen-to-square"></i>
     <button class="delete-btn">
       <i class="fa-solid fa-trash"></i>
     </button>
   </div> `;

  // delete butonuna eris
  const deleteBtn = newDiv.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItems);

  // edit butonuna eris
  const editBtn = newDiv.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItems);

  itemList.appendChild(newDiv);
  showAlert("Eleman Eklendi", "success");
}
//* Sifirlama yapam fonksiyon 
const clearItems = () => {
    const items = document.querySelectorAll(".items-list-item");
    if (items.length > 0) {
      items.forEach((item) => {
        itemList.removeChild(item);
      });
      clearButton.style.display = "none";
      showAlert("Liste Boş", "danger");
      // Localstorage ı temizle
      localStorage.removeItem("items");
    }
  };

// * Localstorage a kayıt yapan fonksiyon
const addToLocalStorage = (id, value) => {
  const item = { id, value };
  let items = getFromLocalStorage();
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
};
// * Localstorage dan verileri alan fonksiyon
const getFromLocalStorage = () => {
  return localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
};

// * Localstorage dan verileri kaldiran fonksiyon
const removeFromLocalStorage = (id) => {
  let items = getFromLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("items", JSON.stringify(items));
};

//* Localstorage i guncelleyen fonksiyon

const updateLocalStorage = (id, newValue) => {
    let items = getFromLocalStorage();
    items = items.map((item) => {
      if (item.id === id) {
        // Spread Operatör: Bu özellik bir elemanı güncellerken veri kaybını önlemek için kullanılır.Burada biz obje içerisinde yer alan value yu güncelledik.Ama bunu yaparken id değerini kaybetmemek için Spread Operatör
        return { ...item, value: newValue };
      }
      return item;
    });
    localStorage.setItem("items", JSON.stringify(items));
  };

// ? olay izleyicileri
//* formun gonderildigi ani yakala
form.addEventListener("submit", addItem);
//* sayfanin yuklendigi ani yakala
window.addEventListener("DOMContentLoaded", renderItems);

// clear butonuna tiklaninca elemanlari sifirlama 
clearButton.addEventListener('click', clearItems)
