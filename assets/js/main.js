const showToast = (message) => {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
};

const copyText = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through for browsers that expose Clipboard API but deny access.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Copy command was rejected");
  }
};

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.dataset.copyTarget);
    if (!target) return;

    try {
      await copyText(target.innerText.trim());
      button.textContent = "Скопировано";
      button.classList.add("is-done");
      showToast("Поздравление скопировано");
      window.setTimeout(() => {
        button.textContent = "Скопировать поздравление";
        button.classList.remove("is-done");
      }, 2200);
    } catch {
      showToast("Не удалось скопировать текст");
    }
  });
});

document.querySelectorAll("[data-reveal]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.reveal);
    if (!target) return;

    const isVisible = target.classList.toggle("is-visible");
    target.setAttribute("aria-hidden", String(!isVisible));
    button.setAttribute("aria-expanded", String(isVisible));

    if (button.dataset.revealLabel && isVisible) {
      button.textContent = button.dataset.revealLabel;
    }
  });
});

document.querySelectorAll("[data-secret-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = form.querySelector("input");
    const message = form.querySelector("[data-secret-message]");
    const target = document.querySelector(form.dataset.secretTarget);
    const answer = form.dataset.secretAnswer;
    if (!input || !message || !target || !answer) return;

    const value = input.value.trim().toLocaleLowerCase("ru-RU");
    const isCorrect = value === answer.toLocaleLowerCase("ru-RU");

    form.classList.toggle("is-error", !isCorrect);
    form.classList.toggle("is-unlocked", isCorrect);
    target.classList.toggle("is-visible", isCorrect);
    target.setAttribute("aria-hidden", String(!isCorrect));

    if (isCorrect) {
      message.textContent = "доступ разрешен · birthday respect level: max";
      input.disabled = true;
      form.querySelector("button").textContent = "открыто ✓";
      target.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    message.textContent = "неверное слово · подсказка: самый оранжевый продукт";
    input.select();
  });
});

const closeModal = (modal) => {
  modal.classList.remove("is-visible");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("has-modal");
};

const openModal = (modal) => {
  modal.classList.add("is-visible");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-modal");
  modal.querySelector("[data-modal-close]")?.focus();
};

document.querySelectorAll("[data-modal-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".anime-modal");
    if (modal) closeModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".anime-modal.is-visible").forEach(closeModal);
  }
});

document.querySelectorAll("[data-key-sequence]").forEach((container) => {
  const sequence = container.dataset.keySequence.toLocaleLowerCase("en-US");
  const target = document.querySelector(container.dataset.keyTarget);
  let buffer = "";

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;
    if (event.target.matches("input, textarea")) return;

    buffer = (buffer + event.key.toLocaleLowerCase("en-US")).slice(-sequence.length);
    if (buffer === sequence && target) {
      openModal(target);
      buffer = "";
    }
  });
});

const home = document.querySelector("[data-home-sequence]");

if (home) {
  const translations = {
    ru: {
      documentTitle: "Не та дверь",
      description: "Закрытая служебная страница персональных поздравлений.",
      brandLabel: "На главную",
      languageLabel: "Язык",
      eyebrow: "служебная страница / 00",
      title: "Не та<br><span>дверь.</span>",
      copy:
        "Здесь нет каталога поздравлений. Нужная ссылка сама находит нужного человека. Почти как курьер, только без звонка за минуту до приезда.",
      check: "Проверить на всякий случай",
      initialReply: "Результат пока подозрительно предсказуем.",
      replies: [
        "Проверено: дверь декоративная.",
        "Поздравлений в открытом доступе: 0 шт.",
        "Сервер подумал и решил ничего не рассказывать.",
        "Ошибка 200: всё работает, просто не для всех.",
      ],
      hint: "Страница иногда слышит, как кто-то печатает слово <span>party</span>.",
      closeLabel: "Закрыть пасхалку",
      secretLabel: "секретный протокол активирован",
      secretTitle: "Ладно. Праздник существует.",
      secretCopy: "Но ссылку всё равно придётся спросить у человека.",
    },
    en: {
      documentTitle: "Wrong door",
      description: "A private service page for personal birthday messages.",
      brandLabel: "Home",
      languageLabel: "Language",
      eyebrow: "service page / 00",
      title: "Wrong<br><span>door.</span>",
      copy:
        "There is no birthday message directory here. The right link finds the right person on its own. Almost like a courier, only without calling one minute before arrival.",
      check: "Double-check anyway",
      initialReply: "The result looks suspiciously predictable.",
      replies: [
        "Checked: the door is decorative.",
        "Publicly available birthday messages: 0.",
        "The server thought about it and decided to say nothing.",
        "Error 200: everything works, just not for everyone.",
      ],
      hint: "Sometimes the page hears someone typing the word <span>party</span>.",
      closeLabel: "Close the Easter egg",
      secretLabel: "secret protocol activated",
      secretTitle: "Fine. The party exists.",
      secretCopy: "But you will still have to ask someone for the link.",
    },
  };
  const checkButton = document.querySelector("[data-home-check]");
  const reply = document.querySelector("[data-home-reply]");
  const secret = document.querySelector("[data-home-secret]");
  const closeButton = document.querySelector("[data-home-secret-close]");
  const languageNav = document.querySelector("[data-home-language]");
  let replyIndex = 0;
  let buffer = "";
  let language = "en";

  const setLanguage = (nextLanguage, persist = true) => {
    language = translations[nextLanguage] ? nextLanguage : "en";
    const text = translations[language];

    document.documentElement.lang = language;
    document.title = text.documentTitle;
    document.querySelector("[data-home-description]")?.setAttribute("content", text.description);
    document.querySelector("[data-home-brand]")?.setAttribute("aria-label", text.brandLabel);
    languageNav?.setAttribute("aria-label", text.languageLabel);
    languageNav?.setAttribute("data-language", language);
    document.querySelectorAll("[data-home-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.homeLang === language));
    });
    document.querySelector("[data-home-eyebrow]").textContent = text.eyebrow;
    document.querySelector("[data-home-title]").innerHTML = text.title;
    document.querySelector("[data-home-copy]").textContent = text.copy;
    document.querySelector("[data-home-hint]").innerHTML = text.hint;
    document.querySelector("[data-home-secret-label]").textContent = text.secretLabel;
    document.querySelector("[data-home-secret-title]").textContent = text.secretTitle;
    document.querySelector("[data-home-secret-copy]").textContent = text.secretCopy;
    closeButton?.setAttribute("aria-label", text.closeLabel);

    if (checkButton) checkButton.textContent = text.check;
    if (reply) reply.textContent = text.initialReply;
    replyIndex = 0;

    if (persist && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      [document.querySelector(".birthday-home__content"), document.querySelector("[data-home-hint]")]
        .filter(Boolean)
        .forEach((element) => {
          element.animate(
            [
              { opacity: 0.35, transform: "translateY(4px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 280, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
          );
        });
    }

    const url = new URL(window.location.href);
    if (language === "ru") {
      url.searchParams.set("lang", "ru");
    } else {
      url.searchParams.delete("lang");
    }
    window.history.replaceState({}, "", url);

    if (persist) {
      try {
        window.localStorage.setItem("birthday-home-language-v2", language);
      } catch {
        // Language still works when storage is unavailable.
      }
    }
  };

  const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
  let savedLanguage;
  try {
    savedLanguage = window.localStorage.getItem("birthday-home-language-v2");
  } catch {
    savedLanguage = null;
  }
  setLanguage(requestedLanguage || savedLanguage || "en", false);

  document.querySelectorAll("[data-home-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.homeLang === language) return;
      setLanguage(button.dataset.homeLang);
    });
  });

  checkButton?.addEventListener("click", () => {
    if (!reply) return;
    const replies = translations[language].replies;
    reply.textContent = replies[replyIndex % replies.length];
    replyIndex += 1;
  });

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;
    if (event.target.matches("input, textarea")) return;

    const sequence = home.dataset.homeSequence.toLocaleLowerCase("en-US");
    buffer = (buffer + event.key.toLocaleLowerCase("en-US")).slice(-sequence.length);

    if (buffer === sequence && secret) {
      secret.classList.add("is-visible");
      secret.setAttribute("aria-hidden", "false");
      closeButton?.focus();
      buffer = "";
    }
  });

  closeButton?.addEventListener("click", () => {
    secret?.classList.remove("is-visible");
    secret?.setAttribute("aria-hidden", "true");
    checkButton?.focus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !secret?.classList.contains("is-visible")) return;
    secret.classList.remove("is-visible");
    secret.setAttribute("aria-hidden", "true");
    checkButton?.focus();
  });
}
