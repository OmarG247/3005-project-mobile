export const populateRoles = `
    insert into roles (
        role_ID, role_name
    )
    values (
        'r-00', 'admin'
    ),
    (
        'r-01', 'user'
    );
`;


export const populateUsers = `
    insert into users (
        user_ID, role_id, username, password, card_number, year, month, address, phone_number
    )
    values (
        'u-01', 'r-00', 'jeremy', 'password', 123456, 2021, 4, '123 Carleton', '6131111235'
    ),
    (
         'u-02', 'r-00', 'omar', 'password', 987654, 2021, 5, '123 Greenboro', '6131999999'
    ),
    (
        'u-03', 'r-01', 'john', 'password', 654321, 2022, 6, '555 Carling', '6136008907'
    ),
    (
        'u-04', 'r-01', 'david', 'password', 19819, 1999, 12, '555 Carling', '6136008906'
    );
`;


export const populatePubs = `
    insert into publisher (
      publisher_ID, name, bank_number, address, phone_num, sale
    )
    values (
        'p-01', 'cheap', 123456, '123 fake', '6137371111', 10
    ),
    (
        'p-02', 'medium', 999999, '578 crestahven', '6131111111', 20
    ),
    (
        'p-03', 'expensive', 890712, '99 carleton', '6199998888', 50
    ),
    (
        'p-04', 'free', 789324, '123 pizza', '6138907654',0
    );
`;

export const bookAmount = `
    select count(book_ID) from book;`;

export const sales = `
    select sum(price) from orders`;

export const salesPerGenre = `
    select sum(book.price), genre
    from book 
        inner join item on book.book_ID = item.book_ID,
        inner join order on order_Id = item.order_id
    group by
        genre;`;

export const salesPerAuthor = `
    select sum(book.price), author
    from book 
        inner join item on book.book_ID = item.book_ID,
        inner join order on order_Id = item.order_id
    group by
        author;`;

export const clearItem = `
    drop table item;
    `;

export const clearBook = `
    drop table book;
    `;
export const clearPub = `
    drop table publisher;
    `;
export const clearOrder = `
    drop table orders;    `;
export const clearUser= `
    drop table users;
    `;
export const clearRoles = `
    drop table roles;
    `;
export const clearAuthors = `
    drop table author;
    `;
export const clearGenres = `
    drop table genre;
    `;