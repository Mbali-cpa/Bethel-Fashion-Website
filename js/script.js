document.addEventListener("DOMContentLoaded", function () {

    // Select all collection images
   const collectionImages = document.querySelectorAll(
    ".collection-image, .hero__image, .card__image"
);

   
    // Create the lightbox dialog
    const lightbox = document.createElement("dialog");
    lightbox.className = "image-lightbox";

    // Create the close button
    const closeButton = document.createElement("button");
    closeButton.className = "lightbox-close";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Close image");

    // Create the enlarged image
    const enlargedImage = document.createElement("img");
    enlargedImage.className = "lightbox-image";

    // Create the image caption
    const caption = document.createElement("p");
    caption.className = "lightbox-caption";

    // Add elements to the lightbox
    lightbox.append(closeButton, enlargedImage, caption);

    // Add lightbox to the webpage
    document.body.appendChild(lightbox);

    // Open images when clicked
    collectionImages.forEach(function (image) {

        image.style.cursor = "zoom-in";
        image.setAttribute("tabindex", "0");
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", "View enlarged image: " + image.alt);

        function openLightbox() {
            enlargedImage.src = image.src;
            enlargedImage.alt = image.alt;
            caption.textContent = image.alt;

            lightbox.showModal();
        }

        image.addEventListener("click", openLightbox);

        // Allow keyboard interaction
        image.addEventListener("keydown", function (event) {

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox();
            }

        });

    });

    // Close using the close button
    closeButton.addEventListener("click", function () {
        lightbox.close();
    });

    // Close when clicking outside the image
    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {
            lightbox.close();
        }

    });

});

// COLLECTION SEARCH FUNCTIONALITY

const searchInput = document.getElementById("collectionSearch");
const searchButton = document.getElementById("searchButton");
const searchMessage = document.getElementById("searchMessage");

if (searchInput && searchButton && searchMessage) {

    function searchCollections() {

        const searchValue = searchInput.value.trim().toLowerCase();

        const collections = [
            {
                id: "womens-apparel",
                keywords: ["clothing", "women", "apparel", "clothes"]
            },
            {
                id: "shoes",
                keywords: ["shoes", "footwear", "sneakers"]
            },
            {
                id: "fashion-accessories",
                keywords: ["accessories", "jewellery", "jewelry", "bags"]
            }
        ];

        if (searchValue === "") {
            searchMessage.textContent = "Please enter a collection to search.";
            return;
        }

        const result = collections.find(function (collection) {
            return collection.keywords.some(function (keyword) {
                return keyword.includes(searchValue) ||
                       searchValue.includes(keyword);
            });
        });

        if (result) {

            const section = document.getElementById(result.id);

            searchMessage.textContent = "Collection found!";

            section.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        } else {

            searchMessage.textContent =
                "Sorry, no matching collection was found. Try clothing, shoes or accessories.";
        }
    }

    searchButton.addEventListener("click", searchCollections);

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchCollections();
        }
    });
}


// ENQUIRY FORM VALIDATION

const enquiryForm = document.getElementById("enquiryForm");

if (enquiryForm) {

    const enquiryFeedback = document.getElementById("enquiryFeedback");


      enquiryForm.addEventListener("submit", async function(event) {
        event.preventDefault();

const fullname = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const enquiryType = document.getElementById("enquiry-type").value;
        const message = document.getElementById("message").value.trim();

        // Check required fields
if (!enquiryForm.checkValidity()) {
    enquiryForm.reportValidity();
    return;
}


// Validate email address
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
    enquiryFeedback.textContent =
        "Please enter a valid email address.";

    document.getElementById("email").focus();
    return;
}
        // Validate South African phone number
        const cleanPhone = phone.replace(/[\s()-]/g, "");

        const phonePattern = /^(0\d{9}|\+27\d{9})$/;

        if (!phonePattern.test(cleanPhone)) {
            enquiryFeedback.textContent =
                "Please enter a valid South African phone number.";
            return;
        }

        // Validate message length
        if (message.length < 10) {
            enquiryFeedback.textContent =
                "Please provide more details about your enquiry.";
            return;
        }

        // Generate a response based on enquiry type
        let response;

        switch (enquiryType) {

            case "product-information":
                response = "Thank you! Our team will assist you with product information.";
                break;

            case "product-price":
                response = "Thank you! Your price enquiry has been received. Our team will assist you.";
                break;

            case "product-availability":
                response = "Thank you! We will assist you with product availability.";
                break;

            case "orders":
                response = "Thank you! Your order enquiry has been received.";
                break;

            case "womens-clothing":
                response = "Thank you for your interest in our women's clothing collection.";
                break;

            case "footwear":
                response = "Thank you for your interest in our footwear collection.";
                break;

            case "fashion-accessories":
                response = "Thank you for your interest in our fashion accessories.";
                break;

            default:
                response = "Thank you for contacting Bethel Fashion.";
        }

    // Submit the enquiry to Netlify
try {
    const formData = new FormData(enquiryForm);

    const netlifyResponse = await fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(formData).toString()
    });

    if (netlifyResponse.ok) {
        enquiryFeedback.textContent =
            "Thank you, " + fullname + "! " + response;

        enquiryForm.reset();
    } else {
        enquiryFeedback.textContent =
            "Sorry, your enquiry could not be submitted. Please try again.";
    }

} catch (error) {
    enquiryFeedback.textContent =
        "There was a connection problem. Please try again.";
}

    });

}