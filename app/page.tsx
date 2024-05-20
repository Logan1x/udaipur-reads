"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Book {
  bookName: string;
  author: string;
  avgRating: string;
  dateAdded: Date;
  goodReadsURL: string;
  bookCover: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const parseRSS = (data: string) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "text/xml");
    return xml;
  };

  const logBookDetails = (items: HTMLCollectionOf<Element> | any) => {
    const books = [];
    for (let i = 0; i < items.length; i++) {
      let bookName =
        items[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
      let author =
        items[i].getElementsByTagName("author_name")[0].childNodes[0].nodeValue;
      let avgRating =
        items[i].getElementsByTagName("average_rating")[0].childNodes[0]
          .nodeValue; // Adjust this based on your RSS structure
      let dateAdded = new Date(
        items[i].getElementsByTagName(
          "user_date_added"
        )[0].childNodes[0].nodeValue
      );

      let goodReadsURL = items[i]
        .getElementsByTagName("description")[0]
        .childNodes[1].nodeValue.match(/href="([^"]*)/)[1];
      goodReadsURL = goodReadsURL.split("?")[0];

      let bookCover = items[i].getElementsByTagName("book_medium_image_url")[0]
        .childNodes[0].nodeValue;

      books.push({
        bookName,
        author,
        avgRating,
        dateAdded,
        goodReadsURL,
        bookCover,
      });
    }
    return books;
  };

  const getData = async () => {
    setIsLoading(true);
    const res = await axios.get("/sync");
    const parsedRSS = parseRSS(res.data);
    const items = parsedRSS.getElementsByTagName("item");
    const parsedBooks = logBookDetails(items);
    setBooks(parsedBooks);
    setIsLoading(false);
  };
  return (
    <main className="grow flex flex-col items-center justify-between p-20 bg-slate-50 text-slate-800">
      <div className="container text-center">
        {isLoading ? (
          <h1>
            Loading <span className="animate-ping">...</span>
          </h1>
        ) : books.length === 0 ? (
          <>
            <h1 className="mt-2 text-3xl">
              Welcome to Udaipur Book Club's Showpage.
            </h1>
            <p className="mb-2 text-md text-slate-600">
              Click below to know our favorites.
            </p>
            <button
              onClick={getData}
              className="bg-slate-900 text-slate-50 px-4 py-2 mt-4 rounded shadow-md hover:bg-slate-800  transition-all duration-300"
            >
              Get Books
            </button>
          </>
        ) : (
          <>
            <h1 className="mb-6 text-3xl">Past picks</h1>
            <div className="flex justify-center flex-wrap gap-6 text-left">
              {books.map((book) => (
                <Link
                  key={book.bookName}
                  className="border w-48 p-2 flex flex-col gap-1 rounded shadow-sm hover:bg-slate-100 hover:shadow-md transform hover:scale-105 transition-all duration-300"
                  href={book.goodReadsURL}
                  target="_blank"
                >
                  <img
                    className="justify-center w-48 h-72 object-cover rounded-sm"
                    src={book.bookCover}
                    alt={book.bookName}
                  />
                  <h2
                    className={
                      book.bookName.length > 20
                        ? `font-semibold truncate ...`
                        : "font-semibold"
                    }
                  >
                    {book.bookName}
                  </h2>
                  <p>{book.author}</p>
                  <div className="text-xs text-slate-500 flex items-center">
                    <svg
                      dataSlot="icon"
                      fill="none"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="w-4 h-4 inline-block mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                      />
                    </svg>
                    <span>{book.avgRating}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    <span>
                      <svg
                        dataSlot="icon"
                        fill="none"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="w-4 h-4 inline-block mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </span>
                    {book.dateAdded.toDateString()}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
