import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import React, { useContext } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";
import { FormLayout } from "../components/FormLayout";
import { MyContext } from "../components/MyProvider";
import { MuiLayout } from "../components/MuiLayout";

export interface DirectorType {
  name: string;
}

export interface MovieType {
  title: string;
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

  genres: string[];
  rating: string;
  review: string;
  year: string;
  [key: string]: string | string[];
}

export interface ErrArr {
  title: string | undefined;
  dirname: string | undefined;
  genres: string | undefined;
  rating: string | undefined;
  review: string | undefined;
  year: string | undefined;
  coverPic: string | undefined;
}

export const initialErrArr: ErrArr = {
  title: undefined,
  dirname: undefined,
  genres: undefined,
  rating: undefined,
  review: undefined,
  year: undefined,
  coverPic: undefined,
};

export const initialMovie: MovieType = {
  title: "",
  director: {
    name: "",
  },
  genres: [],
  rating: "",
  review: "",
  year: "",
};

export const initialMovieProps: MovieProps = {
  title: "",
  dirname: "",
  genres: [],
  rating: "",
  review: "",
  year: "",
};

export const movieGenres = [
  "Action",
  "Anime",
  "Adventure",
  "Biography",
  "Comedy",
  "Crime",
  "Drama",
  "Documentary",
  "Fantasy",
  "History",
  "Horror",
  "Legal",
  "Mystery",
  "Musical",
  "Romance",
  "Sci-Fi",
  "Sports",
  "Thriller",
  "War",
  "Western",
  "SitCom",
];

export const AddMovie = () => {
  const [movie, setMovie] = React.useState<MovieProps>(initialMovieProps);
  const [coverPicFile, setCoverPicFile] = React.useState<{} | undefined>({});
  const [next, setNext] = React.useState(false);
  const navigate = useNavigate();
  const [isLoad, setIsLoad] = React.useState(false);
  const [errArr, setErrArr] = React.useState<ErrArr>(initialErrArr);
  const { token } = useContext(MyContext);

  React.useEffect(() => {
    if (!token.tokenStr) {
      navigate("/login");
    }
  }, [token, navigate]);

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

    if (Object.values(errArr).every((el) => el === "") && next) {
      setIsLoad(true);
      const formData: MovieType = {
        title: movie.title,
        director: {
          name: movie.dirname,
        },
        genres: movie.genres,
        rating: movie.rating,
        review: movie.review,
        year: movie.year,
      };

      const formDataObj: any = new FormData();
      formDataObj.append("coverPic", coverPicFile);

      for (const key in formData) {
        if (key === "director" || key === "genres") {
          formDataObj.append(key, JSON.stringify(formData[key]));
        } else {
          formDataObj.append(key, formData[key]);
        }
      }

      token.tokenStr && newMovie(formDataObj);
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
      default:
        break;
    }
  };

  const newMovie = async (movie: any) => {
    const myHeaders = new Headers();

    myHeaders.append("Authorization", `Bearer ${token.tokenStr}`);

    const raw = movie;
    const url = `${process.env.REACT_APP_BASE_URL}/movies`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      });
      if (res.status === 201) {
        navigate(-1);
      } else if (res.status === 401) {
        navigate("/login");
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
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
      <FormLayout>
        <Stack sx={{ width: "100%", maxWidth: "380px" }}>
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
                    autoComplete="off"
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
                    autoComplete="off"
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
                    autoComplete="off"
                  />
                  <TextField
                    error={errArr.review ? true : false}
                    variant="standard"
                    placeholder="please provide short and sweet review"
                    name="review"
                    multiline
                    rows={3}
                    required
                    value={movie.review}
                    onChange={handleChange}
                    helperText={errArr.review !== "" ? errArr.review : null}
                    onBlur={(e) => validateMovie("review", e.target.value)}
                    autoComplete="off"
                  />
                </>
              ) : (
                <>
                  <TextField
                    required
                    error={errArr.genres ? true : false}
                    variant="standard"
                    label="genres"
                    name="genres"
                    value={movie.genres}
                    onChange={handleChange}
                    onBlur={(e) => validateMovie("genres", e.target.value)}
                    helperText={errArr.genres !== "" ? errArr.genres : null}
                    select
                    SelectProps={{ multiple: true, autoWidth: true }}
                    autoComplete="off"
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
                    autoComplete="off"
                  />
                  <br />
                </>
              )}

              <Box
                sx={{
                  maxWidth: "200px",
                  display: next ? "flex" : "none",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <label>Cover Image</label>
                <input
                  onChange={(e) => {
                    if (e.target?.files) {
                      setCoverPicFile(e.target.files[0]);
                    }
                    if (e.target.value) {
                      setErrArr((pre) => {
                        return { ...pre, [e.target.name]: "" };
                      });
                    } else {
                      setErrArr((pre) => {
                        return { ...pre, [e.target.name]: undefined };
                      });
                    }
                  }}
                  name="coverPic"
                  type="file"
                  accept="image/jpg, image/jpeg, image/png"
                />
                {errArr.coverPic === undefined && (
                  <small style={{ color: "red" }}>
                    Please upload a cover picture for movie!!
                  </small>
                )}
              </Box>
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
                  <Button
                    size="small"
                    variant="contained"
                    type="submit"
                    disabled={isLoad}
                  >
                    {isLoad ? "Loading" : "Submit"}
                  </Button>
                </Stack>
              )}
            </Stack>
          </form>
        </Stack>
      </FormLayout>
    </MuiLayout>
  );
};
