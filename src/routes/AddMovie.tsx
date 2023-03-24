import { Button, MenuItem, Stack, TextField } from "@mui/material";
import React from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";
import { FormLayout } from "../components/FormLayout";
import { MyContext } from "../components/MyProvider";

export interface DirectorType {
  name: string;
  gender: string;
}

export interface MovieType {
  title: "";
  director: DirectorType;
  genres: string[];
  rating: number | string;
  review: string;
  year: number | string;
  [key: string]: string | number | DirectorType | string[];
}

export interface MovieProps {
  title: string;
  dirname: string;
  dirgender: string;
  genres: string[];
  rating: string;
  review: string;
  year: string;
  [key: string]: string | string[];
}

export interface ErrArr {
  title: string | undefined;
  dirname: string | undefined;
  dirgender: string | undefined;
  genres: string | undefined;
  rating: string | undefined;
  review: string | undefined;
  year: string | undefined;
}

export const initialErrArr: ErrArr = {
  title: undefined,
  dirname: undefined,
  dirgender: undefined,
  genres: undefined,
  rating: undefined,
  review: undefined,
  year: undefined,
};

export const initialMovie: MovieType = {
  title: "",
  director: {
    name: "",
    gender: "",
  },
  genres: [],
  rating: "",
  review: "",
  year: "",
};

export const initialMovieProps: MovieProps = {
  title: "",
  dirname: "",
  dirgender: "",
  genres: [],
  rating: "",
  review: "",
  year: "",
};

export const movieGenres = [
  "Action",
  "Anime",
  "Adventure",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Legal",
  "Mystery",
  "Musical",
  "Romance",
  "Sci/Fi",
  "Thriller",
  "Western",
  "SitCom",
];

export const AddMovie = () => {
  const [movie, setMovie] = React.useState<MovieProps>(initialMovieProps);
  const [next, setNext] = React.useState(false);
  const { token } = React.useContext(MyContext);
  const navigate = useNavigate();
  const [isLoad, setIsLoad] = React.useState(false);
  const [errArr, setErrArr] = React.useState<ErrArr>(initialErrArr);

  React.useEffect(() => {
    if (!token.tokenStr) {
      navigate("/login");
    }
  }, [token.tokenStr, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //if it is array
    if (e.target.name === "genres") {
      const newVal: any = e.target.value;
      if (newVal.length <= 3) {
        return setMovie((pre) => {
          return {
            ...pre,
            [e.target.name]: newVal,
          };
        });
      } else {
        alert("cant choose more than three genres");
      }
      return;
    }

    return setMovie((pre) => {
      return {
        ...pre,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmitted = (e: any) => {
    e.preventDefault();
    console.log({ errArr });
    if (!errArr.title && !errArr.rating && !errArr.review && !errArr.year) {
      setNext(true);
    }

    if (Object.values(errArr).every((el) => el === "") && next) {
      setIsLoad(true);
      const clonedMovie = JSON.parse(JSON.stringify(movie));
      const formData: MovieType = {
        title: clonedMovie.title,
        director: {
          name: clonedMovie.dirname,
          gender: clonedMovie.dirgender,
        },
        genres: clonedMovie.genres,
        rating: clonedMovie.rating,
        review: clonedMovie.review,
        year: clonedMovie.year,
      };
      // console.log(formData);
      token.tokenStr && newMovie(formData);
    }
  };

  const validateMovie = (key: string, value: string) => {
    //
    switch (key) {
      case "title":
        setMovie((pre) => {
          return {
            ...pre,
            title: value.trim(),
          };
        });
        setErrArr((pre: any) => {
          if (value === "") {
            return { ...pre, title: `can't be empty` };
          } else {
            return { ...pre, title: "" };
          }
        });

        break;
      case "rating":
        setMovie((pre) => {
          return {
            ...pre,
            rating: value.trim(),
          };
        });

        setErrArr((pre: any) => {
          if (!/^[1-9]\d*(\.\d+)?$/.test(value)) {
            return { ...pre, rating: `Invalid Input` };
          } else if (Number(value) > 5) {
            return { ...pre, rating: "not greater than 5" };
          } else {
            return { ...pre, rating: "" };
          }
        });

        break;

      case "year":
        setMovie((pre) => {
          return {
            ...pre,
            year: value.trim(),
          };
        });
        setErrArr((pre: any) => {
          if (!/^(19[1-9]\d|2\d{3})$/.test(value.trim() as string)) {
            return { ...pre, year: `year must be greater than 1910` };
          } else {
            return { ...pre, year: "" };
          }
        });
        break;
      case "review":
        setMovie((pre) => {
          return {
            ...pre,
            review: value.slice(0, 60).trim(),
          };
        });
        setErrArr((pre: any) => {
          if (value === "") {
            return { ...pre, review: `can't be empty` };
          } else if (value.length > 60) {
            return { ...pre, review: "too much characters" };
          } else {
            return { ...pre, review: "" };
          }
        });
        break;
      case "genres":
        setErrArr((pre) => {
          if (value.length === 0) {
            return { ...pre, genres: `can't be empty` };
          } else {
            return { ...pre, genres: "" };
          }
        });
        break;
      case "dirname":
        setMovie((pre) => {
          return {
            ...pre,
            dirname: value.trim(),
          };
        });
        setErrArr((pre: any) => {
          if (value === "") {
            return { ...pre, dirname: `can't be empty` };
          } else {
            return { ...pre, dirname: "" };
          }
        });
        break;
      case "dirgender":
        setErrArr((pre: any) => {
          if (value === "") {
            return { ...pre, dirgender: `can't be empty` };
          } else {
            return { ...pre, dirgender: "" };
          }
        });
        break;
      default:
        break;
    }
  };

  const newMovie = async (movie: MovieType) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token.tokenStr}`);
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(movie);
    const url = `${process.env.REACT_APP_BASE_URL}/movies`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      });
      // const data = await res.json();
      if (res.status === 201) {
        navigate("/");
      } else {
        throw Error("cannot create the movie");
      }
    } catch (err) {
      navigate(`/error/${err}`);
    }
  };

  return (
    <FormLayout>
      <Stack>
        <form onSubmit={(e) => handleSubmitted(e)}>
          <Stack spacing={1} sx={{ mb: 2 }}>
            {!next ? (
              <>
                <TextField
                  error={errArr.title ? true : false}
                  variant="standard"
                  label="title"
                  name="title"
                  required
                  value={movie.title}
                  helperText={errArr.title !== "" ? errArr.title : null}
                  onBlur={(e) => validateMovie("title", e.target.value)}
                  onChange={handleChange}
                />

                <TextField
                  error={errArr.rating ? true : false}
                  variant="standard"
                  label="rating"
                  name="rating"
                  required
                  value={!movie.rating ? "" : movie.rating}
                  helperText={
                    !movie.rating
                      ? `Please rate 1 to 5`
                      : errArr.rating !== ""
                      ? errArr.rating
                      : null
                  }
                  onBlur={(e) => validateMovie("rating", e.target.value)}
                  onChange={handleChange}
                />
                <TextField
                  style={{ marginBottom: "1rem" }}
                  error={errArr.year ? true : false}
                  variant="standard"
                  label="released year"
                  name="year"
                  required
                  value={!movie.year ? "" : movie.year}
                  onChange={handleChange}
                  helperText={errArr.year !== "" ? errArr.year : null}
                  onBlur={(e) => validateMovie("year", e.target.value)}
                />
                <TextField
                  error={errArr.review ? true : false}
                  variant="outlined"
                  placeholder="please provide short and sweet review"
                  name="review"
                  multiline
                  rows={3}
                  required
                  value={movie.review}
                  onChange={handleChange}
                  helperText={errArr.review !== "" ? errArr.review : null}
                  onBlur={(e) => validateMovie("review", e.target.value)}
                />
              </>
            ) : (
              <>
                <TextField
                  error={errArr.genres ? true : false}
                  variant="standard"
                  label="genres"
                  name="genres"
                  value={movie.genres}
                  onChange={handleChange}
                  onBlur={(e) => validateMovie("genres", e.target.value)}
                  select
                  SelectProps={{ multiple: true }}
                >
                  {movieGenres.map((el) => {
                    return (
                      <MenuItem key={el} value={el}>
                        {el}
                      </MenuItem>
                    );
                  })}
                </TextField>
                <TextField
                  error={errArr.dirname ? true : false}
                  required
                  variant="standard"
                  label="director name"
                  name="dirname"
                  value={movie.dirname}
                  helperText={errArr.dirname !== "" ? errArr.dirname : null}
                  onChange={handleChange}
                  onBlur={(e) => validateMovie("dirname", e.target.value)}
                />
                <TextField
                  error={errArr.dirgender ? true : false}
                  variant="standard"
                  label="director gender"
                  name="dirgender"
                  value={movie.dirgender}
                  helperText={errArr.dirgender !== "" ? errArr.dirgender : null}
                  onChange={handleChange}
                  onBlur={(e) => validateMovie("dirgender", e.target.value)}
                  select
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </TextField>
              </>
            )}
          </Stack>
          <Stack direction="row-reverse">
            {!next ? (
              <IconButton aria-label="next" size="small" type="submit">
                <ArrowForwardIcon />
              </IconButton>
            ) : (
              <Stack
                width="100%"
                direction={"row"}
                justifyContent="space-between"
              >
                <IconButton
                  aria-label="goback"
                  onClick={() => setNext(false)}
                  size="small"
                >
                  <ArrowBackIcon />
                </IconButton>
                <Button size="small" variant="contained" type="submit">
                  {isLoad ? "Loading" : "Submit"}
                </Button>
              </Stack>
            )}
          </Stack>
        </form>
        {!token.tokenStr && next && (
          <small style={{ textAlign: "right" }}>Please Login</small>
        )}
      </Stack>
    </FormLayout>
  );
};