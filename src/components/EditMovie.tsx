import {
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { initialMovie, movieGenres, MovieType } from "./AddMovie";
import { FormLayout } from "./FormLayout";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MyContext } from "./MyProvider";

export const EditMovie = () => {
  const { movieId } = useParams();
  const { token } = React.useContext(MyContext);
  const [editMovie, setEditMovie] = React.useState<MovieType>(initialMovie);
  const [errObj, setErrObj] = React.useState<any>({});
  const [next, setNext] = React.useState(false);
  const [submitFail, setSubmitFail] = React.useState(false);
  console.log({ editMovie });
  const navigate = useNavigate();
  React.useEffect(() => {
    setTimeout(() => setSubmitFail(false), 900);
  }, [submitFail]);
  React.useEffect(() => {
    const fetchData = async (url: string, id: string | undefined) => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}/${url}/${id}`,
          {
            method: "GET",
            redirect: "follow",
          }
        );
        const data = await res.json();

        if (res.status === 200) {
          setEditMovie(data.data);
        } else {
          throw Error("Cannot fetch the movie");
        }
      } catch (err) {
        navigate(`error/${err}`);
      }
    };
    movieId && fetchData("movies", movieId);
  }, [movieId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\s+/.test(e.target.value)) {
      return;
    }
    const dirArr = ["name", "phoneNo", "gender"];
    if (dirArr.some((el) => el === e.target.name)) {
      setEditMovie((pre) => {
        return {
          ...pre,
          director: {
            ...pre.director,
            [e.target.name]: e.target.value,
          },
        };
      });
    }

    setEditMovie((pre) => {
      return {
        ...pre,
        [e.target.name]:
          e.target.name === "year" || e.target.name === "rating"
            ? Number(e.target.value)
            : e.target.value,
      };
    });
  };

  const validate = (movie: MovieType): boolean => {
    const error: any = {};
    const clonedMovie = JSON.parse(JSON.stringify(movie));
    const dirObj = clonedMovie.director;
    delete clonedMovie.director;
    delete clonedMovie.__v;
    const testObj = { ...clonedMovie, ...dirObj };
    for (let key in testObj) {
      if (typeof testObj[key] === "string") {
        if (testObj[key].trim() === "") {
          error[key] = `can't be empty`;
        }
      } else if (typeof testObj[key] === "number") {
        if (testObj[key] <= 0) {
          error[key] = `can't be zero or less`;
        } else if (key === "year" && testObj[key].toString().length !== 4) {
          error[key] = "must be 4 figures";
        } else if (key === "rating" && testObj[key] > 5) {
          error[key] = "please rate 1 out of 5";
        }
      }
    }

    console.log(error);

    if (!Object.keys(error).length) {
      setSubmitFail(false);
      return true;
    } else {
      setSubmitFail(true);
      setErrObj(error);
      return false;
    }
  };

  const toEdit = async (movieId: string | undefined, tokenId: string) => {
    const url = `${process.env.REACT_APP_BASE_URL}/movies/${movieId}`;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${tokenId}`);
    const raw = JSON.stringify(editMovie);
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      });
      if (res.status === 200) {
        navigate("/");
      } else {
        throw Error("cannot update the movie");
      }
    } catch (error) {
      navigate(`error/${error}`);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate(editMovie)) {
      toEdit(movieId, token.tokenStr);
    }
  };

  return (
    <FormLayout>
      {/* show loading while fetching data */}
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Stack spacing={1}>
            {!next ? (
              <>
                <TextField
                  required
                  label="title"
                  name="title"
                  variant="standard"
                  value={editMovie.title}
                  onChange={handleChange}
                  helperText={!errObj.title ? " " : errObj.title}
                />
                <TextField
                  required
                  label="review"
                  name="review"
                  variant="standard"
                  value={editMovie.review}
                  onChange={handleChange}
                  helperText={!errObj.review ? " " : errObj.review}
                />
                <TextField
                  required
                  label="rating"
                  name="rating"
                  variant="standard"
                  value={editMovie.rating}
                  onChange={handleChange}
                  helperText={!errObj.rating ? " " : errObj.rating}
                />
                <TextField
                  required
                  label="released year"
                  name="year"
                  variant="standard"
                  value={editMovie.year}
                  onChange={handleChange}
                  helperText={!errObj.year ? " " : errObj.year}
                />{" "}
              </>
            ) : (
              <>
                <TextField
                  required
                  label="director name"
                  name="name"
                  variant="standard"
                  value={editMovie.director.name}
                  onChange={handleChange}
                  helperText={!errObj.name ? " " : errObj.name}
                />
                <TextField
                  variant="standard"
                  label="director gender"
                  name="genres"
                  value={editMovie.genres}
                  onChange={handleChange}
                  helperText={!errObj.genres ? " " : errObj.genres}
                  select
                >
                  {movieGenres.map((el) => {
                    return <MenuItem value={el}>{el}</MenuItem>;
                  })}
                </TextField>
                <TextField
                  required
                  select
                  label="gender"
                  name="gender"
                  variant="standard"
                  value={editMovie.director.gender}
                  onChange={handleChange}
                  helperText={!errObj.gender ? " " : errObj.gender}
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
                <Button type="submit" size="small" variant="contained">
                  Submit
                </Button>
              </Stack>
            )}
          </Stack>
          <Typography height={2} align="right" color="error">
            {submitFail && next
              ? "Failed to submit"
              : !token.tokenStr && next
              ? "Please Login"
              : " "}
          </Typography>
        </Stack>
      </form>
    </FormLayout>
  );
};
