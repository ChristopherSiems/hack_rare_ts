async function sign_up() {
  const response = await fetch("http://localhost:3000/api/sign_up", {
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

async function sign_in_success() {
  const response = await fetch("http://localhost:3000/api/sign_in", {
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

async function sign_in_fail() {
  const response = await fetch("http://localhost:3000/api/sign_in", {
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

sign_up();
sign_in_fail();
sign_in_success();
