describe("Authentication Flow", () => {
  it("should load the home page", () => {
    cy.visit("/");
    cy.url().should("include", "/");
  });

  

  it("should show error on invalid login", () => {
    cy.visit("/login");
    cy.get("input[type='email']").type("wrong@example.com");
    cy.get("input[type='password']").type("wrongpassword");
    cy.get("button[type='submit']").click();
    cy.get("p.text-red-600", { timeout: 5000 }).should("exist");
  });

  it("should navigate to register page", () => {
    cy.visit("/register");
    cy.get("input#name").should("exist");
    cy.get("input#username").should("exist");
    cy.get("input#email").should("exist");
    cy.get("input#password").should("exist");
    cy.get("input#confirmPassword").should("exist");
  });

  it("should show error on mismatched passwords", () => {
    cy.visit("/register");
    cy.get("input#name").type("Shreesha Shrestha");
    cy.get("input#username").type("shreesha123");
    cy.get("input#email").type("shreesha@example.com");
    cy.get("input#password").type("password123");
    cy.get("input#confirmPassword").type("differentpassword");
    cy.get("button[type='submit']").click();
    cy.get("p.text-red-600", { timeout: 5000 }).should("exist");
  });

  

  it("should navigate from register to login page", () => {
    cy.visit("/register");
    cy.contains("Log in").click();
    cy.url().should("include", "/login");
  });

  it("should navigate to forgot password page", () => {
    cy.visit("/login");
    cy.contains("Forgot Password").click();
    cy.url().should("include", "/forgot-password");
  });

  // ── 7 NEW TESTS BELOW ──────────────────────────────────────────────────────

  // Test 9
  it("should show validation error when login form is submitted empty", () => {
    cy.visit("/login");
    cy.get("button[type='submit']").click();
    cy.get("p.text-red-600", { timeout: 5000 }).should("exist");
  });

  // Test 10
  it("should show validation error when register form is submitted empty", () => {
    cy.visit("/register");
    cy.get("button[type='submit']").click();
    cy.get("p.text-red-600", { timeout: 5000 }).should("exist");
  });


  

  // Test 11
  it("should retain typed values in login fields after failed submission", () => {
    cy.visit("/login");
    cy.get("input[type='email']").type("test@example.com");
    cy.get("input[type='password']").type("wrongpassword");
    cy.get("button[type='submit']").click();
    cy.get("input[type='email']").should("have.value", "test@example.com");
  });

  // Test 13
  it("should retain typed values in register fields after failed submission", () => {
    cy.visit("/register");
    cy.get("input#name").type("Shreesha Shrestha");
    cy.get("input#username").type("shreesha123");
    cy.get("input#email").type("shreesha@example.com");
    cy.get("input#password").type("password123");
    cy.get("input#confirmPassword").type("differentpassword");
    cy.get("button[type='submit']").click();
    cy.get("input#email").should("have.value", "shreesha@example.com");
  });
})

  

