let elements = {
  rejectModal: document.getElementById("rejectModal"),
  reason: document.getElementById("reason"),
  unapproveModal: document.getElementById("unapproveModal"),
  unapproveReason: document.getElementById("unapproveReason"),

  toastContainer: document.getElementById("toastContainer"),
  unapproved: document.getElementById("unapproved"),
  approved: document.getElementById("approved"),
  rejected: document.getElementById("rejected"),
};

let rejectModal, unapproveModal;

async function approve(id) {
  let body = JSON.stringify({
    id: id,
  });
  let requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://brackets.pepega.workers.dev/approve`, requestOptions);
    let result = await response.json();
    showToast(result.message, "info", 3000);
    loadUnapproved();
    loadApproved();
    loadRejected();
  } catch (error) {
    showToast("Could not approve bracket", "danger", 3000);
    console.log("approve error", error);
  }
} //approve

async function unreject(id) {
  let body = JSON.stringify({
    id: id,
  });
  let requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://brackets.pepega.workers.dev/unreject`, requestOptions);
    let result = await response.json();
    showToast(result.message, "info", 3000);
    loadUnapproved();
    loadApproved();
    loadRejected();
  } catch (error) {
    showToast("Could not unreject bracket", "danger", 3000);
    console.log("unreject error", error);
  }
} //unreject

let rejectID = "";
function reject(id) {
  rejectID = id;
  rejectModal.show();
} //reject

async function rejectSubmit() {
  let body = JSON.stringify({
    id: rejectID,
    reason: elements.reason.value,
  });
  let requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://brackets.pepega.workers.dev/reject`, requestOptions);
    let result = await response.json();
    showToast(result.message, "info", 3000);
    rejectModal.hide();
    loadUnapproved();
    loadApproved();
    loadRejected();
  } catch (error) {
    showToast("Could not reject bracket", "danger", 3000);
    console.log("reject error", error);
  }
} //rejectSubmit

let unapproveID = "";
function unapprove(id) {
  unapproveID = id;
  unapproveModal.show();
} //unapprove

async function unapproveSubmit() {
  let body = JSON.stringify({
    id: unapproveID,
    reason: elements.unapproveReason.value,
  });
  let requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://brackets.pepega.workers.dev/unapprove`, requestOptions);
    let result = await response.json();
    showToast(result.message, "info", 3000);
    unapproveModal.hide();
    loadUnapproved();
    loadApproved();
    loadRejected();
  } catch (error) {
    showToast("Could not unapprove bracket", "danger", 3000);
    console.log("unapprove error", error);
  }
} //unapproveSubmit

async function loadUnapproved() {
  elements.unapproved.innerHTML = spinner;
  let requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://brackets.pepega.workers.dev/unapproved`, requestOptions);
    let result = await response.json();
    if (result.length == 0) {
      elements.unapproved.innerHTML = "No brackets in queue :)";
      return;
    }
    let html = "";
    for (let index = 0; index < result.length; index++) {
      html += `
      <div class="card">
      <div class="card-header">${result[index].id} - ${result[index].username} - ${result[index].userid} - ${result[index].time}</div>
      <div class="card-body">
      <h5 class="card-title">${result[index].bracket.title}</h5>
      <p class="card-text">${result[index].bracket.description}</p>
      Options(${result[index].bracket.options.length}):
      <ul class="list-group" style="max-height: 500px; overflow: auto">`;
      for (let index2 = 0; index2 < result[index].bracket.options.length; index2++) {
        html += `<li class="list-group-item">${result[index].bracket.options[index2].name} - ${result[index].bracket.options[index2].value}</li>`;
      }
      html += `
      </ul>
      <button type="button" class="btn btn-success float-end mt-3" onclick="approve('${result[index].id}')">Approve</button>
      <button type="button" class="btn btn-danger float-end mt-3 me-2" onclick="reject('${result[index].id}')">Reject</button>
      </div>
      </div>`;
    }
    elements.unapproved.innerHTML = html;
    linkifyElementID("unapproved");
    console.log(result);
  } catch (error) {
    showToast("Could not load unapproved", "danger", 3000);
    console.log(error);
  }
} //loadUnapproved

async function loadApproved() {
  elements.approved.innerHTML = spinner;
  let requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://brackets.pepega.workers.dev/approved`, requestOptions);
    let result = await response.json();
    if (result.length == 0) {
      elements.approved.innerHTML = "No approved brackets found :(";
      return;
    }
    let html = "";
    html += `
      <div class="card">
      <div class="card-header">${result.length} approved brackets</div>
      <div class="card-body">
      <ul class="list-group" style="max-height: 500px; overflow: auto">`;
    for (let index = 0; index < result.length; index++) {
      html += `
      <li class="list-group-item">${result[index].id} - ${result[index].username} - ${result[index].bracket.title} - ${result[index].bracket.description} - ${result[index].bracket.options.length} options 
      <button type="button" class="btn btn-danger float-end mt-3 me-2" onclick="unapprove('${result[index].id}')">Unapprove</button>
      </li>`;
    }
    html += `
    </ul>
    </div>
    </div>`;

    elements.approved.innerHTML = html;
    linkifyElementID("approved");
    console.log(result);
  } catch (error) {
    showToast("Could not load approved", "danger", 3000);
    console.log(error);
  }
} //loadApproved

async function loadRejected() {
  elements.rejected.innerHTML = spinner;
  let requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://brackets.pepega.workers.dev/rejected`, requestOptions);
    let result = await response.json();
    if (result.length == 0) {
      elements.rejected.innerHTML = "No rejected brackets found :)";
      return;
    }
    let html = "";
    html += `
      <div class="card">
      <div class="card-header">${result.length} rejected brackets</div>
      <div class="card-body">
      <ul class="list-group" style="max-height: 500px; overflow: auto">`;
    for (let index = 0; index < result.length; index++) {
      html += `
      <li class="list-group-item">${result[index].id} - ${result[index].username} - reject reason: ${result[index].reason} -  ${result[index].bracket.title} - ${result[index].bracket.description} - ${result[index].bracket.options.length} options 
      <button type="button" class="btn btn-danger float-end mt-3 me-2" onclick="unreject('${result[index].id}')">Unreject</button>
      </li>`;
    }
    html += `
    </ul>
    </div>
    </div>`;

    elements.rejected.innerHTML = html;
    linkifyElementID("rejected");
    console.log(result);
  } catch (error) {
    showToast("Could not load rejected", "danger", 3000);
    console.log(error);
  }
} //loadRejected

window.onload = async function () {
  let requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };
  try {
    let response = await fetch(`https://brackets.pepega.workers.dev/check`, requestOptions);
    let result = await response.json();
    if (response.status !== 200 || result.message !== "OK") {
      alert("You don't have permission to view this page");
      return;
    }
  } catch (error) {
    alert("You don't have permission to view this page");
    return;
  }

  loadUnapproved();
  loadApproved();
  loadRejected();

  rejectModal = new bootstrap.Modal(elements.rejectModal);
  unapproveModal = new bootstrap.Modal(elements.unapproveModal);
}; //onload
