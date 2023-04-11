import {
  Stack,
  TextField,
  MenuItem,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import {
  ErrArr,
  initialErrArr,
  initialMovieProps,
  movieGenres,
  MovieProps,
  MovieType,
} from "../routes/AddMovie";
import { FormLayout } from "../components/FormLayout";
import { MyContext } from "../components/MyProvider";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MuiLayout } from "../components/MuiLayout";

export const EditMovie = () => {
  const { movieId } = useParams();
  const { token } = useContext(MyContext);
  const [editMovie, setEditMovie] =
    React.useState<MovieProps>(initialMovieProps);
  const [next, setNext] = React.useState(false);
  const [isLoad, setIsLoad] = React.useState(false);
  const [errArr, setErrArr] = React.useState<ErrArr>(initialErrArr);
  const navigate = useNavigate();

  //ensuring all  errArr[key]= "" at only FIRST LOAD of component
  React.useEffect(() => {
    //deep cloned an errObj and set its properties to ""
    const errArrCloned = JSON.parse(JSON.stringify(errArr));
    for (let key in errArrCloned) {
      errArrCloned[key] = "";
    }
    setErrArr(errArrCloned);
  }, []);

  //fetching related movie
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
          const fetchedMovie = data.data;
          const director = fetchedMovie.director;
          delete fetchedMovie.director;
          setEditMovie(() => {
            return {
              ...fetchedMovie,
              dirgender: director.gender,
              dirname: director.name,
            };
          });
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
    //if it is array
    if (e.target.name === "genres") {
      const newVal: any = e.target.value;
      if (newVal.length <= 3) {
        return setEditMovie((pre) => {
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

    return setEditMovie((pre) => {
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

    if (Object.values(errArr).every((el) => el === "") && next) {
      setIsLoad(true);

      const formData: MovieType = {
        title: editMovie.title,
        director: {
          name: editMovie.dirname,
          gender: editMovie.dirgender,
        },
        genres: editMovie.genres,
        rating: editMovie.rating,
        review: editMovie.review,
        year: editMovie.year,
        photoUrl: editMovie.photoUrl,
        photoId: editMovie.photoId,
      };
      const formDataObj: any = new FormData(e.target);

      //deleting redundant keys
      formDataObj.delete("dirname");
      formDataObj.delete("dirgender");
      formDataObj.delete("genres");

      for (const key in formData) {
        if (key === "director" || key === "genres") {
          formDataObj.append(key, JSON.stringify(formData[key]));
        } else {
          formDataObj.append(key, formData[key]);
        }
      }

      token.tokenStr && updateMovie(formDataObj);
    }
  };

  const validateMovie = (key: string, value: string) => {
    //
    switch (key) {
      case "title":
        setEditMovie((pre) => {
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
        setEditMovie((pre) => {
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
        setEditMovie((pre) => {
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
        setEditMovie((pre) => {
          return {
            ...pre,
            review: value.trim(),
          };
        });
        setErrArr((pre: any) => {
          if (value === "") {
            return { ...pre, review: `can't be empty` };
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
        setEditMovie((pre) => {
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
      case "coverPic":
        setErrArr((pre: any) => {
          if (value === "") {
            return { ...pre, coverPic: `can't be empty` };
          } else {
            return { ...pre, coverPic: "" };
          }
        });
        break;
      default:
        break;
    }
  };

  const updateMovie = async (movie: any) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token.tokenStr}`);
    myHeaders.append("Content-Type", `multipart/form-data`);

    const url = `${process.env.REACT_APP_BASE_URL}/movies/${movieId}`;
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: myHeaders,
        body: movie,
        redirect: "follow",
      });
      // const data = await res.json();
      if (res.status === 200) {
        navigate("/");
      } else {
        throw Error("cannot update the movie");
      }
    } catch (err) {
      navigate(`/error/${err}`);
    }
  };

  return (
    <MuiLayout>
      <Button
        sx={{ alignSelf: "flex-start", mb: 2 }}
        startIcon={<ArrowBackIcon />}
        component={RouterLink}
        to={`/`}
      >
        Main Page
      </Button>
      <FormLayout>
        {!editMovie ? (
          "Loading"
        ) : (
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
                      value={editMovie.title}
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
                      value={!editMovie.rating ? "" : editMovie.rating}
                      helperText={
                        !editMovie.rating
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
                      value={!editMovie.year ? "" : editMovie.year}
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
                      value={editMovie.review}
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
                      value={editMovie.genres}
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
                      value={editMovie.dirname}
                      helperText={errArr.dirname !== "" ? errArr.dirname : null}
                      onChange={handleChange}
                      onBlur={(e) => validateMovie("dirname", e.target.value)}
                    />
                    <TextField
                      error={errArr.dirgender ? true : false}
                      variant="standard"
                      label="director gender"
                      name="dirgender"
                      value={editMovie.dirgender}
                      helperText={
                        errArr.dirgender !== "" ? errArr.dirgender : null
                      }
                      onChange={handleChange}
                      onBlur={(e) => validateMovie("dirgender", e.target.value)}
                      select
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </TextField>
                    <br />
                    <Box
                      sx={{
                        maxWidth: "200px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                      }}
                    >
                      <label>Change Cover Image</label>
                      <input
                        onBlur={(e) =>
                          validateMovie("coverPic", e.target.value)
                        }
                        name="coverPic"
                        type="file"
                        accept="image/*"
                      />
                    </Box>
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
                      {isLoad ? "Loading" : "Edit"}
                    </Button>
                  </Stack>
                )}
              </Stack>
            </form>
          </Stack>
        )}
      </FormLayout>
    </MuiLayout>
  );
};
