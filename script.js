/* =========================================================
   Amber Einstein Tutoring — Microsite behavior
   - "Book This Package" buttons prefill the inquiry form
   - No-backend lead capture:
       1) Tries FormSubmit AJAX (forwards to the target email)
       2) Falls back to a mailto: draft if the network call fails
   ========================================================= */
(function () {
  "use strict";

  // ---- Configuration (mirrors config.json; kept inline so the site
  //      works when opened directly from the file system too) ----
  var CONFIG = {
    email: "AmberEinsteinTutoring@gmail.com",
    endpoint: "https://formsubmit.co/ajax/AmberEinsteinTutoring@gmail.com",
    subject: "New Inquiry — Amber Einstein Tutoring Website",
    successMessage:
      "Thank you! Your inquiry has been sent to Amber Einstein Tutoring. You'll hear back soon. \u2665",
    errorMessage:
      "We couldn't send automatically — opening your email app as a backup…"
  };

  var form = document.getElementById("leadForm");
  var statusEl = document.getElementById("formStatus");
  var submitBtn = document.getElementById("submitBtn");
  var packageSelect = document.getElementById("package");

  /* ---- Package buttons prefill the form ---- */
  document.querySelectorAll(".book-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pkg = btn.getAttribute("data-package") || "";
      if (packageSelect) {
        // Match select option that starts with the same label text
        var label = pkg.split("—")[0].trim();
        Array.prototype.forEach.call(packageSelect.options, function (opt) {
          if (opt.value.indexOf(label) === 0) packageSelect.value = opt.value;
        });
      }
      var contact = document.getElementById("contact");
      if (contact) contact.scrollIntoView({ behavior: "smooth" });
      setTimeout(function () {
        var msg = document.getElementById("message");
        if (msg && !msg.value) {
          msg.value = "I'm interested in the " + pkg + ". Please share availability.";
        }
        var name = document.getElementById("name");
        if (name) name.focus();
      }, 600);
    });
  });

  /* ---- Validation helpers ---- */
  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = "form-status" + (type ? " " + type : "");
  }

  function markInvalid(el, bad) {
    if (bad) el.classList.add("invalid");
    else el.classList.remove("invalid");
  }

  /* ---- Build a mailto: fallback ---- */
  function buildMailto(data) {
    var lines = [
      "Name: " + data.name,
      "Email: " + data.email,
      "Phone: " + (data.phone || "—"),
      "Student / Grade: " + (data.student || "—"),
      "Package of Interest: " + (data.package || "—"),
      "",
      "Message:",
      data.message
    ];
    return (
      "mailto:" +
      CONFIG.email +
      "?subject=" +
      encodeURIComponent(CONFIG.subject) +
      "&body=" +
      encodeURIComponent(lines.join("\n"))
    );
  }

  /* ---- Submit handler ---- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      student: form.student.value.trim(),
      package: form.package.value,
      message: form.message.value.trim()
    };

    // Validate required fields
    var errors = false;
    markInvalid(form.name, !data.name);
    markInvalid(form.email, !isEmail(data.email));
    markInvalid(form.message, !data.message);
    if (!data.name || !isEmail(data.email) || !data.message) errors = true;

    if (errors) {
      setStatus("Please complete the required fields (Name, valid Email, Message).", "err");
      return;
    }

    setStatus("Sending your inquiry…", "");
    submitBtn.disabled = true;

    // Payload for FormSubmit
    var payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || "Not provided",
      student: data.student || "Not provided",
      package: data.package || "Not specified",
      message: data.message,
      _subject: CONFIG.subject,
      _template: "table"
    };

    fetch(CONFIG.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Bad response");
        return res.json();
      })
      .then(function () {
        setStatus(CONFIG.successMessage, "ok");
        form.reset();
        submitBtn.disabled = false;
      })
      .catch(function () {
        // Fallback: open the visitor's email client with a prefilled draft
        setStatus(CONFIG.errorMessage, "err");
        submitBtn.disabled = false;
        window.location.href = buildMailto(data);
      });
  });

  /* ---- Clear invalid state as the user types ---- */
  ["name", "email", "message"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", function () { markInvalid(el, false); });
  });
})();
