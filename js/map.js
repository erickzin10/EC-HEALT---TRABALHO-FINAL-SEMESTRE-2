function setCookie(name, value, minutes) {
    const date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

async function initMap(lat, lng) {
    console.log(lat);
    console.log(lng);
    const mapDiv = document.getElementById("map");
    const mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyCd6E4Jy7zz1Tuih3z0z_jiujfDDJABDBw&center=${lat},${lng}&zoom=14`;

    mapDiv.innerHTML = `<iframe width="600" height="250" frameborder="0" style="border:0" src="${mapUrl}" allowfullscreen></iframe>`;
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Usuário negou a solicitação de Geolocalização.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("As informações de localização não estão disponíveis.");
            break;
        case error.TIMEOUT:
            alert("A solicitação para obter a localização do usuário expirou.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Ocorreu um erro desconhecido.");
            break;
    }
}

function requestGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            initMap(lat, lng);
        }, showError);
    } else {
        alert("Geolocalização não é suportada por este navegador.");
    }
}

function showConsentDialog() {
    const consentDialog = document.getElementById("consent-dialog");
    consentDialog.style.display = "flex";

    document.getElementById("consent-yes").addEventListener("click", function () {
        setCookie("geolocationConsent", "true", 10);
        consentDialog.style.display = "none";
        requestGeolocation();
    });

    document.getElementById("consent-no").addEventListener("click", function () {
        setCookie("geolocationConsent", "false", 10);
        consentDialog.style.display = "none";
        alert("Geolocalização não permitida.");
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const consent = getCookie("geolocationConsent");
    if (consent === "true") {
        requestGeolocation();
    } else if (consent === "") {
        showConsentDialog();
    } else {
        alert("Geolocalização não permitida.");
    }
});
