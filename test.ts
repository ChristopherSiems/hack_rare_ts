async function sign_up_user() {
  const response = await fetch("http://localhost:3000/api/users/sign_up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "user@example.com",
      password: "mypassword",
      age: 25,
      country: "USA",
      patient: true,
      disease: "diabetes",
      genes: ["BRCA1", "BRCA2"],
      animal: "dog",
      verb: "run",
      adjective: "fast",
    }),
  });

  const data = await response.json();
  console.log(data);
}

async function sign_in_success_user() {
  const response = await fetch("http://localhost:3000/api/users/sign_in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "user@example.com",
      password: "mypassword",
    }),
  });

  const data = await response.json();
  console.log(data);
}

async function sign_in_fail_user() {
  const response = await fetch("http://localhost:3000/api/users/sign_in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "user@example.com",
      password: "my_password",
    }),
  });

  const data = await response.json();
  console.log(data);
}

async function sign_up_org() {
  const response = await fetch("http://localhost:3000/api/orgs/sign_up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "user@example.com",
      password: "mypassword",
      country: "USA",
      disease: "diabetes",
    }),
  });

  const data = await response.json();
  console.log(data);
}

async function sign_in_success_org() {
  const response = await fetch("http://localhost:3000/api/orgs/sign_in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "user@example.com",
      password: "mypassword",
    }),
  });

  const data = await response.json();
  console.log(data);
}

async function sign_in_fail_org() {
  const response = await fetch("http://localhost:3000/api/orgs/sign_in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "user@example.com",
      password: "my_password",
    }),
  });

  const data = await response.json();
  console.log(data);
}

sign_up_user();
sign_in_fail_user();
sign_in_success_user();
sign_up_org();
sign_in_fail_org();
sign_in_success_org();
