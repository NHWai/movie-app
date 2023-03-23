import {
  Button,
  MenuItem,
  Stack,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import React from "react";
import { FormLayout } from "./FormLayout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { MyContext } from "./MyProvider";
import { useNavigate } from "react-router-dom";

export type DirectorType = {
  name: string;
  gender: string;
};

export type MovieType = {
  title: "";
  director: DirectorType;
  genres: string[];
  rating: number | string;
  review: string;
  year: number | string;
  [key: string]: string | number | DirectorType | string[];
};

type MovieProps = {
  title: string;
  dirname: string;
  dirgender: string;
  genres: string[];
  rating: string;
  review: string;
  year: string;
  [key: string]: string | string[];
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
  const [errArr, setErrArr] = React.useState<MovieProps>(initialMovieProps);

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

    if (!errArr.title && !errArr.rating && !errArr.review && !errArr.year) {
      setNext(true);
    }
    if (
      !errArr.title &&
      !errArr.rating &&
      !errArr.review &&
      !errArr.year &&
      !errArr.genres &&
      !errArr.dirname &&
      !errArr.dirgender
    ) {
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

        break;
      case "rating":
        console.log(typeof Number(value));
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
            return { ...pre, year: `year must be greater than 1900` };
          } else {
            return { ...pre, year: "" };
          }
        });
        break;
      case "review":
        setMovie((pre) => {
          return {
            ...pre,
            review: value.trim(),
          };
        });
        break;
      case "dirname":
        setMovie((pre) => {
          return {
            ...pre,
            dirname: value.trim(),
          };
        });
        break;
      default:
        break;
    }
  };

  return (
    <FormLayout>
      <Stack spacing={2}>
        <form onSubmit={(e) => handleSubmitted(e)}>
          <Stack>
            {!next ? (
              <>
                <TextField
                  variant="standard"
                  label="title"
                  name="title"
                  required
                  value={movie.title}
                  helperText={errArr.title !== "" ? errArr.title : " "}
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
                      : " "
                  }
                  onBlur={(e) => validateMovie("rating", e.target.value)}
                  onChange={handleChange}
                />
                <TextField
                  sx={{ mb: 1 }}
                  error={errArr.year ? true : false}
                  variant="standard"
                  label="released year"
                  name="year"
                  required
                  value={!movie.year ? "" : movie.year}
                  onChange={handleChange}
                  helperText={errArr.year !== "" ? errArr.year : " "}
                  onBlur={(e) => validateMovie("year", e.target.value)}
                />
                <TextField
                  variant="outlined"
                  placeholder="please provide short and sweet review"
                  name="review"
                  multiline
                  rows={3}
                  required
                  value={movie.review}
                  onChange={handleChange}
                  helperText={errArr.review !== "" ? errArr.review : " "}
                  onBlur={(e) => validateMovie("review", e.target.value)}
                />
              </>
            ) : (
              <>
                <TextField
                  variant="standard"
                  label="genres"
                  name="genres"
                  value={movie.genres}
                  onChange={handleChange}
                  helperText={" "}
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
                  required
                  variant="standard"
                  label="director name"
                  name="dirname"
                  value={movie.dirname}
                  helperText={errArr.dirname !== "" ? errArr.dirname : " "}
                  onChange={handleChange}
                  onBlur={(e) => validateMovie("dirname", e.target.value)}
                />
                <TextField
                  variant="standard"
                  label="director gender"
                  name="dirgender"
                  value={movie.dirgender}
                  helperText={errArr.dirgender !== "" ? errArr.dirgender : " "}
                  onChange={handleChange}
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
