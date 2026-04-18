// ============================================
// ULTIMART GAMESTOP - AUTH + STATIC CATALOG
// ============================================

const SUPABASE_URL = "https://crcvqtkzpzjudxsagzdx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_poYElyzvYvx_pxAnUqk8PA_Pc9MLVOf";
const INSTAGRAM_ORDER_URL = "https://www.instagram.com/ultimartgamestop?igsh=MWt0aXB4emo3YW81Yw==";

let supabaseClient;
let currentUser = null;
let renderGames = () => {};

const formatCurrency = (amount) => `Rs. ${amount}`;

const createGame = (name, category, priceNum, imageFile = "") => ({
    name,
    category,
    priceNum,
    price: formatCurrency(priceNum),
    imageFile
});

const baseGamesData = [
    createGame("Black Myth: Wukong", "New & Trending", 299, "Black Myth Wukong.jpg"),
    createGame("Elden Ring", "New & Trending", 199, "Elden Ring.jpg"),
    createGame("Stellar Blade", "New & Trending", 199, "Stellar Blade.webp"),
    createGame("The First Berserker: Khazan", "New & Trending", 199, "The First Berserker Khazan.jpg"),
    createGame("Hollow Knight: Silksong", "New & Trending", 199, "Hollow Knight Silksong.jpg"),
    createGame("Ghost of Tsushima", "New & Trending", 199, "Ghost of Tsushima.jpg"),
    createGame("God of War Ragnarok", "New & Trending", 249, "God of War Ragnarok.jpg"),
    createGame("Cities Skylines II", "Simulation & Strategy", 199, "Cities Skylines II.jpg"),
    createGame("Cities Skylines", "Simulation & Strategy", 99, "Cities Skylines.jpg"),
    createGame("Jurassic World Evolution 3", "Simulation & Strategy", 299, "Jurassic World Evolution 3.jpg"),
    createGame("Jurassic World Evolution 2", "Simulation & Strategy", 249, "Jurassic World Evolution 2.png"),
    createGame("Planet Coaster 2", "Simulation & Strategy", 199, "Planet Coaster 2.jpg"),
    createGame("Planet Zoo", "Simulation & Strategy", 199, "Planet Zoo.jpg"),
    createGame("Farming Simulator 25", "Simulation & Strategy", 199, "Farming Simulator 25.jpg"),
    createGame("Spider-Man 2", "Action & Adventure", 249, "Spider-Man 2.jpg"),
    createGame("The Last of Us Part II", "Action & Adventure", 249, "The Last of Us Part II.png"),
    createGame("Assassin's Creed Shadows", "Action & Adventure", 299, "Assassin's Creed Shadows.png"),
    createGame("Days Gone", "Action & Adventure", 199, "Days Gone.jpg"),
    createGame("Red Dead Redemption 2", "Action & Adventure", 199, "Red Dead Redemption 2.jpg"),
    createGame("Hitman: World of Assassination", "Action & Adventure", 199, "Hitman World of Assassination.jpg"),
    createGame("Hitman", "Action & Adventure", 149, "Hitman.jpg"),
    createGame("EA Sports FC26", "Racing & Sports", 349, "EA Sports FC26.avif"),
    createGame("EA Sports FC25", "Racing & Sports", 299, "EA Sports FC25.jpg"),
    createGame("Forza Horizon 5", "Racing & Sports", 199, "Forza Horizon 5.jpg"),
    createGame("F1 25", "Racing & Sports", 349, "F1 25.jpg"),
    createGame("SnowRunner", "Racing & Sports", 149, "SnowRunner.jpg"),
    createGame("Roadcraft", "Racing & Sports", 199, "Roadcraft.jpg"),
    createGame("Need For Speed Unbound", "Racing & Sports", 149, "Need For Speed Unbound.jpg"),
    createGame("Grand Theft Auto V", "Classics & Indie", 199, "Grand_Theft_Auto_V.png"),
    createGame("Hollow Knight", "Classics & Indie", 149, "Hollow Knight.jpg"),
    createGame("Plants vs Zombies Replanted", "Classics & Indie", 149, "Plants vs Zombies Replanted.jpg"),
    createGame("It Takes Two", "Classics & Indie", 149, "It Takes Two.jpg"),
    createGame("Split Fiction", "Classics & Indie", 149, "Split Fiction.jpg"),
    createGame("Palworld", "Classics & Indie", 149, "Palworld.jpg"),
    createGame("Stardew Valley", "Classics & Indie", 99),
    createGame("Tekken 8", "Fighting & Others", 149, "Tekken 8.jpg"),
    createGame("WWE 2K26", "Fighting & Others", 349, "WWE 2K26.jpg"),
    createGame("Mortal Kombat 1", "Fighting & Others", 199, "Mortal Kombat 1.jpeg"),
    createGame("Sekiro: Shadows Die Twice", "Fighting & Others", 99, "Sekiro Shadows Die Twice.jpg"),
    createGame("Cyberpunk 2077", "Fighting & Others", 199, "Cyberpunk 2077.jpg"),
    createGame("Hogwarts Legacy", "Fighting & Others", 199, "Hogwarts Legacy.jpg"),
    createGame("Street Fighter 6", "Fighting & Others", 149)
];

const categoryOrder = [...new Set(baseGamesData.map((game) => game.category))];
let gamesData = baseGamesData.map((game) => ({ ...game }));

try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
    console.error("Supabase failed to load.", error);
}

const escapeHtml = (value = "") =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const formatOrderStatus = (status = "pending") =>
    status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

const encodeAssetPath = (path) => encodeURI(path).replace(/'/g, "%27");

const getGameImageCandidates = (game) => {
    if (!game?.imageFile) {
        return [];
    }

    return [
        `./Source/${game.imageFile}`,
        `./${game.imageFile}`
    ];
};

const loadBackgroundImage = (element, candidates) => {
    if (!element || candidates.length === 0) {
        return;
    }

    element.classList.add("skeleton");

    const tryCandidate = (index) => {
        if (index >= candidates.length) {
            element.classList.remove("skeleton");
            return;
        }

        const nextPath = candidates[index];
        element.style.backgroundImage = `url("${encodeAssetPath(nextPath)}")`;

        const preload = new Image();
        preload.onload = () => {
            element.classList.remove("skeleton");
        };
        preload.onerror = () => {
            tryCandidate(index + 1);
        };
        preload.src = nextPath;
    };

    tryCandidate(0);
};

const OrderManager = {
    async getOrderHistory() {
        if (!currentUser || !supabaseClient) {
            return [];
        }

        try {
            const { data, error } = await supabaseClient
                .from("orders")
                .select(`
                    *,
                    order_items (*)
                `)
                .eq("user_id", currentUser.id)
                .order("created_at", { ascending: false });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error("Error fetching order history:", error);
            return [];
        }
    }
};

const ProfileManager = {
    async loadProfile() {
        if (!currentUser || !supabaseClient) {
            return;
        }

        let profileData = null;

        try {
            const { data, error } = await supabaseClient
                .from("user_profiles")
                .select("*")
                .eq("id", currentUser.id)
                .maybeSingle();

            if (error) {
                throw error;
            }

            profileData = data;
        } catch (error) {
            console.error("Error loading profile:", error);
        }

        const profileInfo = document.getElementById("profileInfo");

        const profileName = [
            profileData?.first_name,
            profileData?.last_name
        ].filter(Boolean).join(" ");

        const displayName =
            profileName ||
            profileData?.username ||
            currentUser.user_metadata?.full_name ||
            currentUser.email;

        if (profileInfo) {
            profileInfo.innerHTML = `
                <div class="profile-header">
                    <h3>${escapeHtml(displayName)}</h3>
                    <p>${escapeHtml(currentUser.email || "")}</p>
                    <p>Member since: ${currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : "Recently joined"}</p>
                    <p>${profileData?.username ? `Username: ${escapeHtml(profileData.username)}` : "Google account connected"}</p>
                </div>
            `;
        }
    }
};

const buildAuthRedirect = (mode) => {
    const redirectUrl = new URL(window.location.href);
    const normalizedPath = redirectUrl.pathname.replace(/index\.html$/, "");

    redirectUrl.hash = "";
    redirectUrl.search = "";
    redirectUrl.pathname = normalizedPath || "/";
    redirectUrl.searchParams.set("mode", mode);

    return redirectUrl.toString();
};

const initApp = () => {
    const catalogContainer = document.getElementById("catalog-container");
    const noResults = document.getElementById("no-results");
    const searchInput = document.getElementById("searchInput");
    const searchDropdown = document.getElementById("searchResults");
    const sortSelect = document.getElementById("sortSelect");
    const profileBtn = document.getElementById("profileBtn");
    const signInBtn = document.getElementById("signInBtn");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const userProfile = document.getElementById("userProfile");
    const userNameDisplay = document.getElementById("userName");
    const authButtons = document.getElementById("authButtons");
    const signInModal = document.getElementById("signInModal");
    const signInGoogleBtn = document.getElementById("signInGoogleBtn");
    const basicInfoForm = document.getElementById("basicInfoForm");
    const submitBasicInfoBtn = document.getElementById("submitBasicInfoBtn");
    const signUpUsername = document.getElementById("signUpUsername");
    const signUpFirstName = document.getElementById("signUpFirstName");
    const signUpLastName = document.getElementById("signUpLastName");
    const signUpEmail = document.getElementById("signUpEmail");
    const signInStatus = document.getElementById("signInStatus");
    const loginModal = document.getElementById("loginModal");
    const loginGoogleBtn = document.getElementById("loginGoogleBtn");
    const loginStatus = document.getElementById("loginStatus");

    const buildCards = (grid, games) => {
        games.forEach((game) => {
            const card = document.createElement("div");
            card.className = "game-card";

            const image = document.createElement("div");
            image.className = "game-image";
            loadBackgroundImage(image, getGameImageCandidates(game));

            const info = document.createElement("div");
            info.className = "game-info";

            const title = document.createElement("div");
            title.className = "game-title";
            title.textContent = game.name;

            const price = document.createElement("div");
            price.className = "game-price";
            price.textContent = game.price;

            const action = document.createElement("a");
            action.className = "dm-btn";
            action.href = INSTAGRAM_ORDER_URL;
            action.target = "_blank";
            action.rel = "noopener noreferrer";
            action.textContent = "DM to Buy";
            action.setAttribute("aria-label", `DM to Buy ${game.name} on Instagram`);

            info.appendChild(title);
            info.appendChild(price);
            info.appendChild(action);

            card.appendChild(image);
            card.appendChild(info);
            grid.appendChild(card);
        });
    };

    renderGames = (term = "", sort = "popular") => {
        const normalizedTerm = term.toLowerCase().trim();
        const filtered = gamesData.filter((game) =>
            game.name.toLowerCase().includes(normalizedTerm)
        );

        if (filtered.length === 0) {
            noResults.classList.remove("hidden");
            catalogContainer.innerHTML = "";
            return;
        }

        noResults.classList.add("hidden");

        const gamesToRender = [...filtered];

        if (sort === "price-asc") {
            gamesToRender.sort((a, b) => a.priceNum - b.priceNum);
        } else if (sort === "price-desc") {
            gamesToRender.sort((a, b) => b.priceNum - a.priceNum);
        } else if (sort === "az") {
            gamesToRender.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === "za") {
            gamesToRender.sort((a, b) => b.name.localeCompare(a.name));
        }

        catalogContainer.innerHTML = "";

        if (sort === "popular") {
            categoryOrder.forEach((category) => {
                const categoryGames = gamesToRender.filter((game) => game.category === category);
                if (categoryGames.length === 0) {
                    return;
                }

                const section = document.createElement("div");
                section.className = "category-section";

                const title = document.createElement("h3");
                title.className = "category-title";
                title.textContent = category;

                const grid = document.createElement("div");
                grid.className = "game-grid";

                buildCards(grid, categoryGames);

                section.appendChild(title);
                section.appendChild(grid);
                catalogContainer.appendChild(section);
            });
            return;
        }

        const grid = document.createElement("div");
        grid.className = "game-grid";
        buildCards(grid, gamesToRender);
        catalogContainer.appendChild(grid);
    };

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const term = searchInput.value.toLowerCase().trim();
            renderGames(term, sortSelect ? sortSelect.value : "popular");

            if (!searchDropdown) {
                return;
            }

            if (!term) {
                searchDropdown.classList.add("hidden");
                return;
            }

            const dropdownGames = gamesData
                .filter((game) => game.name.toLowerCase().includes(term))
                .slice(0, 5);

            searchDropdown.innerHTML = "";

            if (dropdownGames.length === 0) {
                searchDropdown.classList.add("hidden");
                return;
            }

            dropdownGames.forEach((game) => {
                const item = document.createElement("div");
                item.className = "search-dropdown-item";
                const imageWrap = document.createElement("div");
                imageWrap.className = "search-item-img";
                loadBackgroundImage(imageWrap, getGameImageCandidates(game));

                const info = document.createElement("div");
                info.className = "search-item-info";

                const title = document.createElement("span");
                title.className = "search-item-title";
                title.textContent = game.name;

                const price = document.createElement("span");
                price.className = "search-item-price";
                price.textContent = game.price;

                info.appendChild(title);
                info.appendChild(price);
                item.appendChild(imageWrap);
                item.appendChild(info);

                item.addEventListener("click", () => {
                    searchInput.value = game.name;
                    renderGames(game.name.toLowerCase(), sortSelect ? sortSelect.value : "popular");
                    searchDropdown.classList.add("hidden");
                    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
                });

                searchDropdown.appendChild(item);
            });

            searchDropdown.classList.remove("hidden");
        });

        if (searchDropdown) {
            searchInput.addEventListener("focus", () => {
                if (searchInput.value.trim().length > 0 && searchDropdown.children.length > 0) {
                    searchDropdown.classList.remove("hidden");
                }
            });

            document.addEventListener("click", (event) => {
                if (!searchInput.contains(event.target) && !searchDropdown.contains(event.target)) {
                    searchDropdown.classList.add("hidden");
                }
            });
        }
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            renderGames(searchInput ? searchInput.value.toLowerCase().trim() : "", sortSelect.value);
        });
    }

    renderGames();

    const header = document.getElementById("header");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

    const fadeElements = document.querySelectorAll(".fade-in-section");
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observerInstance.unobserve(entry.target);
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach((element) => observer.observe(element));

    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            document.getElementById("profilePage").classList.remove("hidden");
            ProfileManager.loadProfile();
        });
    }

    const requireSupabase = (statusElement, fallbackMessage) => {
        if (supabaseClient) {
            return true;
        }

        if (statusElement) {
            statusElement.textContent = fallbackMessage;
            statusElement.className = "auth-status error";
        }

        return false;
    };

    if (signInBtn) {
        signInBtn.addEventListener("click", () => {
            signInModal.classList.remove("hidden");
            basicInfoForm.classList.add("hidden");
            signUpUsername.value = "";
            signUpFirstName.value = "";
            signUpLastName.value = "";
            signInStatus.textContent = "";
            signInStatus.className = "auth-status";
        });
    }

    if (signInGoogleBtn) {
        signInGoogleBtn.addEventListener("click", async () => {
            if (!requireSupabase(signInStatus, "Google sign-in is unavailable right now.")) {
                return;
            }

            signInStatus.textContent = "Redirecting to Google...";
            signInStatus.className = "auth-status loading";

            try {
                const { error } = await supabaseClient.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                        redirectTo: buildAuthRedirect("signup")
                    }
                });

                if (error) {
                    throw error;
                }
            } catch (error) {
                signInStatus.textContent = `Error: ${error.message}`;
                signInStatus.className = "auth-status error";
                console.error("Google sign-in error:", error);
            }
        });
    }

    if (submitBasicInfoBtn) {
        submitBasicInfoBtn.addEventListener("click", async () => {
            const username = signUpUsername.value.trim();
            const firstName = signUpFirstName.value.trim();
            const lastName = signUpLastName.value.trim();

            if (!username || !firstName || !lastName) {
                signInStatus.textContent = "Please fill in all fields.";
                signInStatus.className = "auth-status error";
                return;
            }

            if (!currentUser || !requireSupabase(signInStatus, "Profile setup is unavailable right now.")) {
                return;
            }

            submitBasicInfoBtn.disabled = true;
            submitBasicInfoBtn.textContent = "Saving...";

            try {
                const { error } = await supabaseClient
                    .from("user_profiles")
                    .upsert({
                        id: currentUser.id,
                        email: currentUser.email,
                        username,
                        first_name: firstName,
                        last_name: lastName,
                        updated_at: new Date().toISOString()
                    });

                if (error) {
                    throw error;
                }

                signInStatus.textContent = "Profile created successfully!";
                signInStatus.className = "auth-status success";

                setTimeout(() => {
                    signInModal.classList.add("hidden");
                    basicInfoForm.classList.add("hidden");
                }, 1200);
            } catch (error) {
                signInStatus.textContent = `Error saving profile: ${error.message}`;
                signInStatus.className = "auth-status error";
                console.error("Profile save error:", error);
            } finally {
                submitBasicInfoBtn.disabled = false;
                submitBasicInfoBtn.textContent = "Complete Sign Up";
            }
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            loginModal.classList.remove("hidden");
            loginStatus.textContent = "";
            loginStatus.className = "auth-status";
        });
    }

    if (loginGoogleBtn) {
        loginGoogleBtn.addEventListener("click", async () => {
            if (!requireSupabase(loginStatus, "Google login is unavailable right now.")) {
                return;
            }

            loginStatus.textContent = "Redirecting to Google...";
            loginStatus.className = "auth-status loading";

            try {
                const { error } = await supabaseClient.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                        redirectTo: buildAuthRedirect("login")
                    }
                });

                if (error) {
                    throw error;
                }
            } catch (error) {
                loginStatus.textContent = `Error: ${error.message}`;
                loginStatus.className = "auth-status error";
                console.error("Google login error:", error);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!supabaseClient) {
                currentUser = null;
                authButtons.classList.remove("hidden");
                userProfile.classList.add("hidden");
                return;
            }

            try {
                logoutBtn.disabled = true;
                logoutBtn.innerHTML = '<i class="bx bx-loader"></i>';

                const { error } = await supabaseClient.auth.signOut();
                if (error) {
                    throw error;
                }

                alert("Logged out successfully!");
            } catch (error) {
                console.error("Logout error:", error);
                alert(`Logout failed: ${error.message}`);
            } finally {
                logoutBtn.disabled = false;
                logoutBtn.innerHTML = '<i class="bx bx-log-out"></i>';
            }
        });
    }

    const applySessionState = (session) => {
        currentUser = session?.user || null;

        if (!currentUser) {
            authButtons.classList.remove("hidden");
            userProfile.classList.add("hidden");
            signInModal.classList.add("hidden");
            loginModal.classList.add("hidden");
            basicInfoForm.classList.add("hidden");
            return;
        }

        authButtons.classList.add("hidden");
        userProfile.classList.remove("hidden");
        userNameDisplay.textContent =
            currentUser.user_metadata?.full_name ||
            currentUser.email ||
            "User";
    };

    if (supabaseClient) {
        supabaseClient.auth.getSession().then(({ data }) => {
            applySessionState(data?.session || null);
        }).catch((error) => {
            console.error("Error getting session:", error);
        });

        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            applySessionState(session);

            if (event !== "SIGNED_IN" || !session?.user) {
                return;
            }

            try {
                const { data: existingProfile, error } = await supabaseClient
                    .from("user_profiles")
                    .select("id")
                    .eq("id", session.user.id)
                    .maybeSingle();

                if (error) {
                    throw error;
                }

                if (!existingProfile) {
                    signUpEmail.value = session.user.email || "";
                    signInModal.classList.remove("hidden");
                    basicInfoForm.classList.remove("hidden");
                    signInStatus.textContent = "";
                    signInStatus.className = "auth-status";
                }
            } catch (error) {
                console.error("Profile check error:", error);
            }
        });
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
