
const SUPABASE_URL = "https://rxtltbxofpydthukesin.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_UqBYM7pB48fGfvIPvoPO3g_OQkizOzJ";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
const messageDivCSS = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 0.8;
        }
    }

    #messageDiv {
        justify-content: center;
        align-items: center;
        opacity: 0.8;
        background-color: var(--button-color);
        border-radius: 0.75rem;
        height: 8rem;
        width: 33rem;
        box-shadow: 0 15px 50px -12px #172c5fc5;
        animation: fadeIn 1s ease;
    }
`;

const stylemessageDiv = document.createElement("style");

stylemessageDiv.textContent = messageDivCSS;

document.head.appendChild(stylemessageDiv);

async function whenSubmit(e) {

    e.preventDefault();

    const nameInput =
        document.getElementById("name").value.trim();

    const emailInput =
        document.getElementById("email").value.trim();

    const passwordInput =
        document.getElementById("password").value;

    const greetingMessage =
        document.getElementById("greeting");

    const messageDiv =
        document.getElementById("messageDiv");

    const messagePlace =
        document.getElementById("message");


    function showMessage(message) {

        messageDiv.style.display = "flex";

        messagePlace.textContent = message;
    }


    const isRegister =
        greetingMessage.innerText === "Sign Up for Games Station";
    if (isRegister) {

        if (!nameInput) {

            showMessage("Please enter your name.");

            return;
        }


        showMessage("Creating your account...");


        const {
            data,
            error
        } = await supabaseClient.auth.signUp({

            email: emailInput,

            password: passwordInput,

            options: {

                data: {
                    username: nameInput
                }

            }

        });


        if (error) {

            console.error(error);

            showMessage(error.message);

            return;
        }


        console.log("Registered user:", data.user);


        if (!data.session) {

            showMessage(
                "Account created successfully. Please check your email to confirm your account."
            );

            setTimeout(() => {

                window.location.href = "index.html";

            }, 4000);

            return;
        }


        showMessage(
            "Register successful. Redirecting you now to Login page"
        );


        setTimeout(() => {

            window.location.href = "index.html";

        }, 3000);

    }

    else {

        showMessage("Logging in...");


        const {
            data,
            error
        } = await supabaseClient.auth.signInWithPassword({

            email: emailInput,

            password: passwordInput

        });


        if (error) {

            console.error(error);

            showMessage(error.message);

            return;
        }


        console.log("Logged in user:", data.user);


        showMessage(
            "Login successful. Redirecting you now to Home page"
        );


        setTimeout(() => {

            window.location.href = "home.html";

        }, 2000);

    }

}