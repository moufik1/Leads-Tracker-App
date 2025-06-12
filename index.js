import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getDatabase,
    ref,
    push,
    onValue,
    remove,
    child
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
    projectId: "leads-tracker-url",
    databaseURL: "https://leads-tracker-url-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInDb = ref(database, 'leads');

const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");

function render(leads) {
    let listItems = "";
    leads.forEach((urlData) => {
        const url = urlData.value || urlData; // Handle both object and string formats
        const key = urlData.key || ''; // Get the Firebase key
        const domain = getDomainFromUrl(url);
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}`;
        
        listItems += `
            <li data-key="${key}">
                <div class="url-content">
                    <img src="${faviconUrl}" alt="${domain} favicon" class="favicon">
                    <a target='_blank' href='${url}'>
                        ${domain}
                    </a>
                </div>
                <button class="delete-item-btn" title="Delete this URL">×</button>
            </li>
        `;
    });
    ulEl.innerHTML = listItems;

    // Add event listeners to all delete buttons
    document.querySelectorAll('.delete-item-btn').forEach(button => {
        button.addEventListener('click', deleteItem);
    });
}

function deleteItem(event) {
    const li = event.target.closest('li');
    const key = li.dataset.key;
    const itemRef = child(referenceInDb, key);
    remove(itemRef);
}

function getDomainFromUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch (e) {
        const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
        return domain || url;
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

onValue(referenceInDb, function(snapshot) {
    const snapshotDoesExist = snapshot.exists();
    if (snapshotDoesExist) {
        const snapshotValue = snapshot.val();
        // Convert the object to an array including the Firebase keys
        const leads = Object.keys(snapshotValue).map(key => ({
            key: key,
            value: snapshotValue[key]
        }));
        render(leads);
    } else {
        ulEl.innerHTML = "";
    }
});

deleteBtn.addEventListener("dblclick", function() {
    remove(referenceInDb);
    ulEl.innerHTML = "";
});

inputBtn.addEventListener("click", function() {
    let inputValue = inputEl.value.trim();
    
    if (!inputValue) {
        alert("Please enter a URL before saving");
        return;
    }
    
    if (!inputValue.startsWith('http://') && !inputValue.startsWith('https://')) {
        inputValue = 'https://' + inputValue;
    }
    
    if (!isValidUrl(inputValue)) {
        alert("Please enter a valid URL (e.g., example.com or https://example.com)");
        return;
    }
    
    push(referenceInDb, inputValue);
    inputEl.value = "";
});