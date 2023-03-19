import { Button, MenuItem, Stack, TextField } from "@mui/material";
import React from "react";
import { FormLayout } from "./FormLayout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { MyContext } from "./MyProvider";
import { useNavigate } from "react-router-dom";

export type DirectorType = {
  name: string;
  phoneNo?: string;
  gender: string;
};

export type MovieType = {
  title: "";
  director: DirectorType;
  rating: number;
  review: string;
  year: number;
  [key: string]: string | number | DirectorType;
};

export const initialMovie: MovieType = {
  title: "",
  director: {
    name: "",
    phoneNo: "",
    gender: "",
  },
  rating: 0,
  review: "",
  year: 0,
};

export const AddMovie = () => {
  const [movie, setMovie] = React.useState<MovieType>(initialMovie);
  const [next, setNext] = React.useState(false);
  const { token } = React.useContext(MyContext);
  const navigate = useNavigate();
  // const [firstRender, setFirstRender] = React.useState(false);

  // React.useEffect(() => {
  //   setFirstRender(true);
  // }, []);

  const validate = (movieObj: MovieType): boolean => {
    const newObj = JSON.parse(JSON.stringify(movieObj));
    const dirObj = newObj.director;
    delete newObj.director;
    const testObj = { ...newObj, ...dirObj };
    let returnbool: boolean = true;
    for (const key in testObj) {
      returnbool = returnbool && helpTextFunc(testObj[key], key) === " ";
    }
    return returnbool;
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

  const handleSubmit = () => {
    validate(movie) && token.tokenStr && newMovie(movie);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.name === "name" ||
      e.target.name === "phoneNo" ||
      e.target.name === "gender"
    ) {
      return setMovie((pre) => {
        return {
          ...pre,
          director: {
            ...pre.director,
            [e.target.name]: e.target.value.trim(),
          },
        };
      });
    }
    return setMovie((pre) => {
      return {
        ...pre,
        [e.target.name]:
          e.target.name === "year" || e.target.name === "rating"
            ? Number(e.target.value)
            : e.target.value,
      };
    });
  };

  const helpTextFunc = (
    term: string | number | undefined,
    type?: string
  ): string => {
    if (typeof term === "string") {
      if (type === "phoneNo") {
        return " ";
      } else if (term.trim() === "") {
        return `can't be empty`;
      }
    }
    if (typeof term === "number") {
      if (term <= 0) {
        return `can't be zero or less`;
      }
      if (type === "year" && term.toString().length !== 4) {
        return "must be 4 figures";
      }
      if (type === "rating" && term > 5) {
        return "please rate 1 out of 5";
      }
    }
    return " ";
  };

  return (
    <FormLayout>
      <Stack spacing={2}>
        <Stack spacing={1}>
          {!next ? (
            <>
              <TextField
                variant="standard"
                label="title"
                name="title"
                required
                value={movie.title}
                helperText={helpTextFunc(movie.title)}
                onChange={handleChange}
              />
              <TextField
                variant="standard"
                label="review"
                name="review"
                required
                value={movie.review}
                helperText={helpTextFunc(movie.review)}
                onChange={handleChange}
              />
              <TextField
                variant="standard"
                label="rating"
                name="rating"
                required
                type="number"
                value={!movie.rating ? "" : movie.rating}
                helperText={helpTextFunc(Number(movie.rating), "rating")}
                onChange={handleChange}
              />
              <TextField
                variant="standard"
                label="released year"
                name="year"
                type="number"
                required
                value={!movie.year ? "" : movie.year}
                helperText={helpTextFunc(Number(movie.year), "year")}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <TextField
                variant="standard"
                label="director name"
                name="name"
                required
                value={movie.director.name}
                helperText={helpTextFunc(movie.director.name)}
                onChange={handleChange}
              />
              <TextField
                variant="standard"
                label="director ph"
                name="phoneNo"
                type="number"
                value={movie.director.phoneNo}
                helperText={helpTextFunc(movie.director.phoneNo, "phoneNo")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  /^0|[1-9]\d*$/.test(e.target.value) && handleChange(e)
                }
              />
              <TextField
                variant="standard"
                label="director gender"
                name="gender"
                value={movie.director.gender}
                helperText={helpTextFunc(movie.director.gender)}
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
            <IconButton
              aria-label="next"
              onClick={() => setNext(true)}
              size="small"
            >
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
              <Button
                disabled={validate(movie) && token.tokenStr ? false : true}
                onClick={handleSubmit}
                size="small"
                variant="contained"
              >
                Submit
              </Button>
            </Stack>
          )}
        </Stack>
        {!token.tokenStr && next && (
          <small style={{ textAlign: "right" }}>Please Login</small>
        )}
      </Stack>
    </FormLayout>
  );
};
