

document.addEventListener("DOMContentLoaded", function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  fetch('data/events.xml')
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");
    const events = xmlDoc.getElementsByTagName("event");
    const container = document.getElementById("events-container");

    let html = "";
    Array.from(events).forEach(event => {
      const title = event.getElementsByTagName("title")[0].textContent;
      const date = event.getElementsByTagName("date")[0].textContent;
      const desc = event.getElementsByTagName("description")[0].textContent;

      html += `
        <div class="event">
          <h3>${title}</h3>
          <p><strong>Date:</strong> ${date}</p>
          <p>${desc}</p>
        </div>
      `;
    });

    container.innerHTML = html;
  })
  .catch(err => {
    console.error("XML load error:", err);
  });

  // Load portfolio data
  fetch('data/portfolio.json')
    .then(response => response.json())
    .then(data => {
      renderResearchWork(data.research_work);
      renderPublications(data.publications);
    })
    .catch(err => console.error("Error loading portfolio data:", err));

  // Load blog data
  fetch('data/blog.json')
    .then(response => response.json())
    .then(posts => {
      renderBlogPosts(posts);
    })
    .catch(err => console.error("Error loading blog data:", err));
  
  // Form validation
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      let valid = true;

      const nameEl = document.getElementById('name');
      const emailEl = document.getElementById('email');
      const messageEl = document.getElementById('message');

      const errorName = document.getElementById('error-name');
      const errorEmail = document.getElementById('error-email');
      const errorMessage = document.getElementById('error-message');

      // Reset messages
      errorName.textContent = '';
      errorEmail.textContent = '';
      errorMessage.textContent = '';
      errorName.style.visibility = 'hidden';
      errorEmail.style.visibility = 'hidden';
      errorMessage.style.visibility = 'hidden';

      if (!nameEl.value.trim()) {
        errorName.textContent = 'Name is required.';
        errorName.style.visibility = 'visible';
        valid = false;
      }
      if (!emailEl.value.trim()) {
        errorEmail.textContent = 'Email is required.';
        errorEmail.style.visibility = 'visible';
        valid = false;
      } else if (!validateEmail(emailEl.value.trim())) {
        errorEmail.textContent = 'Please enter a valid email.';
        errorEmail.style.visibility = 'visible';
        valid = false;
      }
      if (!messageEl.value.trim()) {
        errorMessage.textContent = 'Message is required.';
        errorMessage.style.visibility = 'visible';
        valid = false;
      }

      if (valid) {
        // For now, just show an alert or clear form
        alert('Thank you! Your message has been submitted.');
        form.reset();
      }
    });
  }

});

// Helper functions

function validateEmail(email) {
  // simple email regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function renderResearchWork(work) {
  const section = document.getElementById('research-work');
  if (!section) return;

  const html = `
    <div class="research-title">${work.thesis_title}</div>
    <p><strong>Duration:</strong> ${work.duration}</p>
    <p>${work.summary}</p>
    <p><strong>Supervisor:</strong> ${work.supervisor}</p>
  `;
  section.innerHTML = html;
}

function renderPublications(publications) {
  const section = document.getElementById('publications');
  if (!section) return;
  let html = '<h2>Publications</h2>';
  publications.forEach(pub => {
    html += `<div class="publication">
      <h3>${pub.title}</h3>
      <p><strong>Authors:</strong> ${pub.authors.join(', ')}</p>`;
    if (pub.year) {
      html += `<p><strong>Year:</strong> ${pub.year}</p>`;
    }
    if (pub.journal) {
      html += `<p><strong>Journal:</strong> ${pub.journal}</p>`;
    }
    if (pub.conference) {
      html += `<p><strong>Conference:</strong> ${pub.conference}</p>`;
    }
    if (pub.doi) {
      html += `<p><strong>DOI:</strong> <a href="${pub.doi}" target="_blank">${pub.doi}</a></p>`;
    }
    html += `</div>`;
  });
  section.innerHTML = html;
}

function renderBlogPosts(posts) {
  const container = document.getElementById('posts-container');
  if (!container) return;

  let html = '';
  posts.forEach(post => {
    const excerpt = post.content.length > 300 
      ? post.content.substring(0, 300) + '…'
      : post.content;

    html += `
      <div class="post">
        <h2>${post.title}</h2>
        <p class="meta">${post.date} | ${post.category} | by ${post.author}</p>
        <div class="excerpt">${excerpt}</div>
        <div class="full-content" style="display:none;">${post.content}</div>
        <span class="read-more">Read More</span>
      </div>
    `;
  });
  container.innerHTML = html;

  // add event listeners for "Read More"
  container.querySelectorAll('.read-more').forEach(button => {
    button.addEventListener('click', function() {
      const full = this.previousElementSibling; // .full-content
      const excerptEl = full.previousElementSibling; // .excerpt
      if (full.style.display === 'none') {
        full.style.display = 'block';
        this.textContent = 'Show Less';
        excerptEl.style.display = 'none';
      } else {
        full.style.display = 'none';
        this.textContent = 'Read More';
        excerptEl.style.display = 'block';
      }
    });
  });
}

