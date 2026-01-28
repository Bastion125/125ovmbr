// Дані для професій
const professionData = {
    'Виявляй': {
        title: 'Виявляй',
        role: 'Радіоелектронна розвідка (РЕР)',
        description: 'Робота фахівців радіоелектронної розвідки (РЕР). Виявляти та класифікувати джерела радіовипромінювання противника (зв\'язок, управління БпЛА, навігаційні сигнали), визначати їхню активність і ймовірне місце, фіксувати зміни в ефірі та передавати цілевказання і попередження для вогневих, БпЛА та РЕБ/ППО підрозділів.'
    },
    'Аналізуй': {
        title: 'Аналізуй',
        role: 'Аналітики штабу',
        description: 'Робота аналітиків штабу та операторів розвідданих. Зводити інформацію з РЕР, БпЛА, спостереження, доповідей підрозділів і відкритих джерел в єдину картину обстановки; оцінювати наміри й можливості противника, прогнозувати його дії, визначати пріоритети цілей і ризики; готувати короткі висновки та рекомендації.'
    },
    'Літай': {
        title: 'Літай',
        role: 'Пілоти БпЛА',
        description: 'Робота пілотів і екіпажів безпілотних авіаційних комплексів. Виконувати польоти для розвідки, спостереження, коригування та ураження цілей; давати підрозділу точну інформацію з повітря і допомагати приймати правильні рішення на землі.'
    },
    'Перехоплюй': {
        title: 'Перехоплюй',
        role: 'ППО та РЕБ',
        description: 'Робота фахівців протидії повітряним загрозам — ППО та РЕБ. Виявляти й перехоплювати ворожі безпілотники та канали управління, зменшувати їхню ефективність і захищати підрозділ від повітряних загроз.'
    },
    'Стріляй': {
        title: 'Стріляй',
        role: 'Вогневі розрахунки',
        description: 'Робота стрільців і вогневих розрахунків. Бути там, де рішення переходять у дію; тримати рубіж, прикривати своїх і брати на себе відповідальність у моменти, коли від вогню залежить результат бою.'
    },
    'Накривай': {
        title: 'Накривай',
        role: 'Артилерійські підрозділи',
        description: 'Робота артилерійських підрозділів і розрахунків. Працювати з дальності, за розрахунком і взаємодією; підтримувати свої підрозділи вогнем, змінювати хід бою ще до безпосереднього контакту з противником.'
    },
    'Створюй': {
        title: 'Створюй',
        role: 'Інженери та техніки',
        description: 'Робота інженерів, техніків і майстрів. Проєктувати й збирати рішення для фронту — від безпілотних систем і обладнання до нестандартних інструментів; перетворювати ідеї на працюючі засоби.'
    },
    'Ремонтуй': {
        title: 'Ремонтуй',
        role: 'Техніки та ремонтні групи',
        description: 'Робота техніків і ремонтних груп. Повертати техніку та обладнання до роботи, знаходити й усувати несправності, продовжувати ресурс засобів — щоб підрозділ не зупинявся і міг виконувати завдання без пауз.'
    },
    'Забезпечуй': {
        title: 'Забезпечуй',
        role: 'Військові логісти',
        description: 'Робота військових логістів і тилових служб. Планувати й організовувати постачання, облік і розподіл ресурсів — від техніки та боєприпасів до зв\'язку й побуту; тримати підрозділ у постійній готовності, щоб інші могли зосередитись на виконанні завдань.'
    },
    'Навчай': {
        title: 'Навчай',
        role: 'Інструктори та командири',
        description: 'Робота інструкторів, сержантів і командирів малих підрозділів. Передавати досвід і стандарти, розвивати лідерство, готувати людей до самостійних рішень і відповідальності в команді.'
    },
    'Готуй': {
        title: 'Готуй',
        role: 'Військові кухарі',
        description: 'Робота військових кухарів і господарських підрозділів. Забезпечувати харчування й побут, підтримувати сили та ритм служби — щоб особовий склад міг зосередитись на виконанні своєї роботи.'
    },
    'Вези': {
        title: 'Вези',
        role: 'Водії та транспортні підрозділи',
        description: 'Робота водіїв і транспортних підрозділів. Забезпечувати рух і доставку людей, техніки та ресурсів, з\'єднувати тил і передову, щоб підрозділ був там, де він потрібен, вчасно.'
    },
    'Координуй': {
        title: 'Координуй',
        role: 'Командири та оперативні чергові',
        description: 'Робота командирів, оперативних чергових і пунктів управління. Узгоджувати дії підрозділів, екіпажів БпЛА, РЕР/РЕБ, вогневих і логістичних елементів у часі та просторі; доводити рішення, контролювати виконання, оперативно коригувати плани за зміною обстановки; забезпечувати безперервний зв\'язок і взаємодію з суміжними підрозділами.'
    },
    'Воюй': {
        title: 'Воюй',
        role: 'Піхота',
        description: 'Робота піхотних підрозділів. Бути на передовій, тримати позиції, вести бойові дії та забезпечувати безпеку підрозділу.'
    },
    'Латай': {
        title: 'Латай',
        role: 'Медики',
        description: 'Робота медичних підрозділів. Надавати медичну допомогу пораненим, евакуювати поранених з поля бою та забезпечувати медичне обслуговування особового складу.'
    }
};

// Функція для відкриття модального вікна професії (глобальна)
function openProfessionModal(slogan) {
    const data = professionData[slogan];
    if (!data) {
        console.warn('Дані для професії не знайдено:', slogan);
        return;
    }

    // Створюємо або отримуємо модальне вікно
    let modal = document.getElementById('professionModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'professionModal';
        modal.className = 'profession-modal';
        modal.innerHTML = `
            <div class="profession-modal-backdrop"></div>
            <div class="profession-modal-content">
                <div class="profession-modal-header">
                    <h2 class="profession-modal-title"></h2>
                    <button class="profession-modal-close" aria-label="Закрити">✕</button>
                </div>
                <div class="profession-modal-body">
                    <div class="profession-modal-role"></div>
                    <div class="profession-modal-description"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Заповнюємо дані
    modal.querySelector('.profession-modal-title').textContent = data.title;
    modal.querySelector('.profession-modal-role').textContent = data.role;
    modal.querySelector('.profession-modal-description').textContent = data.description;

    // Додаємо/оновлюємо обробники подій щоразу при відкритті
    const closeBtn = modal.querySelector('.profession-modal-close');
    const backdrop = modal.querySelector('.profession-modal-backdrop');
    const content = modal.querySelector('.profession-modal-content');
    
    // Видаляємо старі обробники (якщо є)
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    newCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeProfessionModal();
    });
    
    // Обробник для backdrop
    const newBackdrop = backdrop.cloneNode(true);
    backdrop.parentNode.replaceChild(newBackdrop, backdrop);
    newBackdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        closeProfessionModal();
    });
    
    // Запобігаємо закриттю при кліку на контент
    if (content) {
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Показуємо модальне вікно
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Робимо функцію глобальною
window.openProfessionModal = openProfessionModal;

// Функція для закриття модального вікна (глобальна)
function closeProfessionModal() {
    const modal = document.getElementById('professionModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Робимо функцію глобальною
window.closeProfessionModal = closeProfessionModal;

// Закриття по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProfessionModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.professions-hero');
    if (!hero) {
        return;
    }

    const cards = hero.querySelectorAll('.profession-card');
    const hotspots = hero.querySelectorAll('.professions-hotspot');
    const slogan = hero.querySelector('.profession-slogan');
    const defaultSlogan = slogan?.dataset.default || 'Спільними зусиллями';
    const baseImage = hero.dataset.base;
    let activeCard = null;
    let pinnedCard = null;
    let isTouch = window.matchMedia('(hover: none)').matches;

    const setBackground = (url) => {
        if (!url) {
            return;
        }
        hero.style.backgroundImage = `url('${url}')`;
    };

    const activate = (item) => {
        const hover = item.dataset.hover;
        const text = item.dataset.slogan;
        if (hover) {
            setBackground(hover);
        }
        if (slogan && text) {
            slogan.textContent = text;
        }
        hero.classList.add('is-hovered');
        cards.forEach((card) => card.classList.toggle('is-active', card === item));
        activeCard = item;
    };

    const reset = () => {
        if (baseImage) {
            setBackground(baseImage);
        }
        if (slogan) {
            slogan.textContent = defaultSlogan;
        }
        hero.classList.remove('is-hovered');
        cards.forEach((c) => c.classList.remove('is-active'));
        activeCard = null;
        pinnedCard = null;
    };

    const bindInteractions = (item) => {
        item.addEventListener('mouseenter', () => {
            if (!isTouch) {
                activate(item);
            }
        });

        item.addEventListener('mouseleave', () => {
            if (!isTouch && !pinnedCard) {
                reset();
            } else if (!isTouch && pinnedCard) {
                activate(pinnedCard);
            }
        });

        item.addEventListener('focus', () => {
            activate(item);
        });

        item.addEventListener('blur', () => {
            if (!isTouch && !pinnedCard) {
                reset();
            }
        });

        item.addEventListener('click', (event) => {
            event.preventDefault();
            const slogan = item.dataset.slogan;
            
            // Якщо є дані для модального вікна, відкриваємо його
            if (slogan && professionData[slogan]) {
                openProfessionModal(slogan);
                return;
            }
            
            // Інакше використовуємо стару логіку
            if (activeCard === item && pinnedCard === item) {
                reset();
                return;
            }
            pinnedCard = item;
            activate(item);
        });
    };

    cards.forEach(bindInteractions);
    hotspots.forEach(bindInteractions);

    document.addEventListener('click', (event) => {
        if (!hero.contains(event.target)) {
            reset();
        }
    });

    window.addEventListener('resize', () => {
        isTouch = window.matchMedia('(hover: none)').matches;
        if (!isTouch && !activeCard) {
            reset();
        }
    });
});
