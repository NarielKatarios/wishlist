import { API_URL } from "./const";
import { createElement } from "./helper";
import { auth, router } from "./index";
import { getUser } from "./service";


export const createWishlist = async pageLogin => {
  const login = auth.login;

  if (!pageLogin) {
    pageLogin = login;
  }

  const user = await getUser(pageLogin);
  const section = createElement('section', {
    className: 'wishlist',
  });

  const container = createElement('div', {
    className: 'container',
  });

  section.append(container);

  const profile = createElement('div', {
    className: 'wishlist__profile profile',
  });

  const avatar = createElement('img', {
    className: 'profile__avatar',
    src: 'img/avatar.png',
    alt: 'Фото Иван Петров'б
  });

  const content = createElement('div', {
    className: 'profile__content',
  });

  const fullname = 
    user.name || user.surname
      ? `${user.name || ''} ${user.surname || ''}`.trim()
      : user.login;

  const title = createElement('h2', {
    className: 'profile__fullname',
    textContent: fullname,
  });

  content.append(title);

  if (user.birthdate) {

    const birthday = new Date(user.birthdate);
    const day = birthday.getDate();
    const month = birthday.toLocaleDateString('default', {month: 'long'});
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    const plural = pluralizeYears(age);
    const ageMessage = `${day} ${month} исполнится ${age} ${plural}`;

    const birthdayElem = createElement('p', {
      className: 'profile__birthday',
      textContent: ageMessage,
    });
    content.append(birthdayElem);
  };

  if (login === pageLogin) {
    const editBtn = createElement('button', {
      className: 'profile__edit',
      innerHTML: `
        <svg class="profile__edit-icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.75 29.25H6.6875L24.1992 11.7384L18.2617 5.80086L0.75 23.3125V29.25ZM3.91667 24.6267L18.2617 10.2817L19.7183 11.7384L5.37333 26.0834H3.91667V24.6267ZM25.0858 1.20919C24.9394 1.06241 24.7654 0.94596 24.5738 0.866506C24.3823 0.787052 24.177 0.746155 23.9696 0.746155C23.7622 0.746155 23.5569 0.787052 23.3653 0.866506C23.1738 0.94596 22.9998 1.06241 22.8533 1.20919L19.9558 4.10669L25.8933 10.0442L28.7908 7.14669C28.9376 7.00021 29.0541 6.82622 29.1335 6.63468C29.213 6.44314 29.2539 6.23781 29.2539 6.03044C29.2539 5.82307 29.213 5.61774 29.1335 5.4262C29.0541 5.23466 28.9376 5.06067 28.7908 4.91419L25.0858 1.20919Z" fill="white"/>
        </svg>
        <span>редактировать профиль</span>`,
      });

    editBtn.addEventListener('click', () => {
      router.setRoute(`/editprofile/${login}`)
    });

    content.append(editBtn);
  }
  profile.append(avatar, content);
  container.append(profile);

  if (user.description) {
    const description = createElement('p', {
      className: 'wishlist__description',
      textContent: user.description,
    });
    container.append(description);
  }

  if (!(Object.keys(user.wish).length)) {
    const noWish = createElement('p', {
      className: 'wishlist__no-wish',
      textContent: 'Список желаний пуст',
    });
    container.append(noWish);
  } else {
    const categoriesList = createElement('ul', {
      className: 'wishlist__categories',
    });
    container.append(categoriesList);
  
    for (const title in user.wish) {
      if (!Object.hasOwnProperty.call(user.wish, title)) {
        return
      }
      const categoriesItem = createElement('li', {
        className: 'categories__item',
      });

      const categoriesTitle = createElement('h3', {
        className: 'categories__title',
        textContent: title,
      });
        
      const wishlist = createElement('ul', {
        className: 'wishlist__items',
      });
      categoriesItem.append(categoriesTitle, wishlist);

      for (const item of user.wish[title]) {
        const itemElem = createElement('li', {
          className: 'item',
        });

        const itemImg = createElement('img', {
          className: 'item__image',
          src: `${API_URL}/${item.img}`,
          alt: item.title,
        });

        const itemTitle = createElement('h4', {
          className: 'item__title',
          textContent: item.title,
        });

        const itemPrice = createElement('h4', {
          className: 'item__price',
          textContent: `${item.price} ${item.currency}`,
        });

        itemElem.append(itemImg, itemTitle, itemPrice);

        if (login === pageLogin) {
          const itemBtn = createElement('button', {
            className: 'item__btn btn btn_castling',
            textContent: 'Выбрать',
          });

          itemElem.append(itemBtn);
          itemBtn.addEventListener('click', () => {
            router.setRoute(`/editwish/${item.id}`)
          });
        }
        wishlist.append(itemElem);
      }
      categoriesList.append(categoriesItem);
    }
  }
  return section;
};