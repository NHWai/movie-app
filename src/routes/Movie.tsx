import {
  Box,
  Button,
  CircularProgress,
  Icon,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MovielistType } from "./Home";
import { ReviewBox } from "../components/ReviewBox";
import { ReviewInput } from "../components/ReviewInput";
import { MyContext } from "../components/MyProvider";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarRateIcon from "@mui/icons-material/StarRate";
import { StarHalf } from "@mui/icons-material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface MovieItemType {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  title: string;
  director: {
    name: string;
    gender: string;
  };
  genres: string[];
  totalRating: number;
  rating: number;
  review: string;
  year: number;
  photoUrl: string;
  photoId: string;
}

interface ReviewType {
  _id: string;
  rating: number;
  comment: string;
  movieId: string;
  userId: string;
  username: string;
}

const Movie = () => {
  const { token } = useContext(MyContext);
  let { id } = useParams();
  const [movieItem, setMovieItem] = useState<MovieItemType>();
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [movieList, setMovieList] = useState<MovielistType[]>([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    const url = "movies";
    const url2 = "reviews";
    const getData = async (id: string) => {
      try {
        //fetching movie
        const fetchMovie = await fetchData(url, id, setMovieItem);
        window.scrollTo(0, 0);
        if (!fetchMovie) {
          throw Error("failed to fetch movie");
        }

        //fetching reviews
        fetchData(url2, id, setReviews);
      } catch (err) {
        navigate(`/error/${err}`);
      }
    };
    id && getData(id);
  }, [id, navigate, isSubmit]);

  React.useEffect(() => {
    const url = `movies/genre`;
    const genre = movieItem?.genres.join(",").toLowerCase();

    fetchData(url, genre as string, setMovieList);
  }, [movieItem]);

  const fetchData = async (
    url: string,
    id: string,
    setFunc: (smth: any) => void
  ) => {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/${url}/${id}`, {
      method: "GET",
      redirect: "follow",
    });
    const data = await res.json();

    if (res.status === 200) {
      setFunc(data.data);
      return true;
    } else {
      return false;
    }
  };

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
      partialVisibilityGutter: 40,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: { max: 1024, min: 900 },
      items: 3,
      partialVisibilityGutter: 30,
    },
    mobileLarge: {
      breakpoint: { max: 900, min: 400 },
      items: 2,
    },
    mobileSmall: {
      breakpoint: { max: 400, min: 0 },
      items: 1,
    },
  };

  const ratingStar = Math.floor(movieItem?.totalRating as number);
  const halfStar = Number.isInteger(movieItem?.totalRating as number) ? 0 : 1;
  const blankStar = 5 - ratingStar - halfStar;
  const ratingStarArr = ratingStar ? new Array(ratingStar).fill(1) : [];
  const blankStarArr = blankStar ? new Array(blankStar).fill(1) : [];

  return (
    <Box
      style={{ minHeight: `calc(100vh - 56px)` }}
      sx={{ paddingX: 1, marginTop: "1rem", paddingBottom: "1rem" }}
    >
      {movieItem && reviews ? (
        <>
          <Box
            sx={{
              p: { md: 1 },
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Button
              sx={{
                position: { md: "absolute" },
                top: 50,
                left: 0,
                transform: "translateY(-100%)",
                alignSelf: "start",
              }}
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>

            <Typography
              flexGrow={1}
              mb="2rem"
              sx={{
                typography: { xs: "h4", sm: "h3" },
                fontWeight: "bold",
              }}
              align="center"
            >
              {movieItem?.title}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "fit-content",
              maxWidth: "800px",
              marginX: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              paddingX: "20px",
              overflow: "hidden",
            }}
          >
            <Stack
              marginX={"auto"}
              width="fit-content"
              direction={{ md: "row" }}
              justifyContent={"start"}
              alignItems={{ xs: "start", md: "center" }}
              spacing={5}
            >
              {movieItem.photoUrl && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: { xs: "fit-content", sm: "500px" },
                    height: "300px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "5px",
                      objectFit: "contain",
                    }}
                    src={movieItem?.photoUrl}
                    alt="coverPhoto"
                  />
                </Box>
              )}
              <Box
                sx={{
                  display: { xs: "none", md: "block" },
                }}
              >
                <Box
                  sx={{
                    borderLeft: "3px solid blue",
                    paddingLeft: "1rem",
                    marginLeft: "-1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <Typography fontStyle={"italic"} variant="h5">
                    Details
                  </Typography>
                </Box>
                <Typography variant="subtitle2" fontStyle={"italic"}>
                  Genres: <b> {movieItem?.genres?.join(",")}</b>
                </Typography>
                <Typography variant="subtitle2" fontStyle={"italic"}>
                  Directed by <b> {movieItem?.director.name}</b>
                </Typography>
                <Typography variant="subtitle2" fontStyle={"italic"}>
                  Released Date: {movieItem?.year}
                </Typography>
                <Typography variant="subtitle2" fontStyle={"italic"}>
                  Rating : {movieItem?.totalRating}
                </Typography>
                <Stack mt={1}>
                  <div>
                    {ratingStarArr.map((el, idx) => (
                      <Icon fontSize="small" key={idx}>
                        <StarRateIcon color="warning" />
                      </Icon>
                    ))}
                    {halfStar !== 0 && (
                      <Icon fontSize="small">
                        <StarHalf color="warning" />
                      </Icon>
                    )}
                    {blankStarArr.map((el, idx) => (
                      <Icon fontSize="small" key={idx}>
                        <StarBorderIcon color="warning" />{" "}
                      </Icon>
                    ))}
                  </div>
                  <Typography ml={1.5} variant="caption">
                    ( {reviews.length + 1}{" "}
                    {reviews.length + 1 === 1 ? "review" : "reviews"} )
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Box
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <Box
                sx={{
                  borderLeft: "3px solid blue",
                  paddingLeft: "1rem",
                  marginLeft: "-1rem",
                  marginBottom: "1rem",
                }}
              >
                <Typography fontStyle={"italic"} variant="h5">
                  Details
                </Typography>
              </Box>
              <Typography variant="subtitle2" fontStyle={"italic"}>
                Genres: <b> {movieItem?.genres?.join(",")}</b>
              </Typography>
              <Typography variant="subtitle2" fontStyle={"italic"}>
                Directed by <b> {movieItem?.director.name}</b>
              </Typography>
              <Typography variant="subtitle2" fontStyle={"italic"}>
                Released Date: {movieItem?.year}
              </Typography>
              <Typography variant="subtitle2" fontStyle={"italic"}>
                Rating : {movieItem?.totalRating}
              </Typography>
              <Stack mt={1}>
                <div>
                  {ratingStarArr.map((el, idx) => (
                    <Icon fontSize="small" key={idx}>
                      <StarRateIcon color="warning" />
                    </Icon>
                  ))}
                  {halfStar !== 0 && (
                    <Icon fontSize="small">
                      <StarHalf color="warning" />
                    </Icon>
                  )}
                  {blankStarArr.map((el, idx) => (
                    <Icon fontSize="small" key={idx}>
                      <StarBorderIcon color="warning" />{" "}
                    </Icon>
                  ))}
                </div>
                <Typography ml={1.5} variant="caption">
                  ( {reviews.length + 1}{" "}
                  {reviews.length + 1 === 1 ? "review" : "reviews"} )
                </Typography>
              </Stack>
            </Box>
            <Stack
              width={"100%"}
              maxWidth={"700px"}
              alignSelf={"start"}
              fontStyle={"italic"}
            >
              <div
                style={{
                  borderLeft: "3px solid blue",
                  paddingLeft: "1rem",
                  marginLeft: "-1rem",
                  marginBottom: "1rem",
                }}
              >
                <Typography variant="h5">Featured Reviews</Typography>
              </div>
              <ReviewBox
                rating={movieItem.rating}
                reviewText={movieItem?.review}
                author={movieItem.user.username}
              />
              {reviews.map((review, idx) => {
                return (
                  <ReviewBox
                    key={idx}
                    reviewText={review.comment}
                    author={review.username}
                    rating={review.rating}
                  />
                );
              })}
              {/*check token string, check login user is not original upload user of the movie ,check login user is not added review */}
              {token.tokenStr &&
                token.id !== movieItem.user._id &&
                !reviews?.some((el) => el.userId === token.id) && (
                  <>
                    <Typography my={2} variant="h6" fontStyle={"italic"}>
                      Add review
                    </Typography>
                    <ReviewInput
                      movieId={movieItem._id}
                      tokenStr={token.tokenStr}
                      userId={token.id}
                      username={token.username}
                      setIsSubmit={setIsSubmit}
                    />
                  </>
                )}
            </Stack>
            {/* Movies with same genres*/}
            {movieList.filter((el) => el._id !== movieItem._id).length > 0 && (
              <Box
                sx={{
                  maxWidth: `${
                    window.innerWidth - 60 > 800 ? 800 : window.innerWidth - 60
                  }px`,
                }}
              >
                <div
                  style={{
                    borderLeft: "3px solid blue",
                    paddingLeft: "1rem",
                    marginLeft: "-1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <Typography fontStyle={"italic"} variant="h5">
                    More Like This
                  </Typography>
                </div>
                <Carousel responsive={responsive}>
                  {movieList
                    ?.filter((el) => el._id !== movieItem._id)
                    .map((el, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          height: "230px",
                          padding: 1,
                          margin: 0.8,
                          borderRadius: "0.3rem",
                          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                          }}
                          component={RouterLink}
                          to={`/movie/${el._id}`}
                        ></Box>
                        <Box
                          sx={{
                            height: "150px",
                            width: "100%",
                            mb: 1,
                          }}
                        >
                          <img
                            src={el.photoUrl}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body1"
                          fontWeight={"bold"}
                          component="div"
                          align="center"
                        >
                          {el.title}
                        </Typography>
                        <Stack
                          flexDirection={"row"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          gap={0.5}
                        >
                          <Typography
                            variant="body2"
                            fontStyle={"italic"}
                          >{`Rating : ${el.rating}`}</Typography>
                          <Stack mt={-1}>
                            <Icon fontSize="small">
                              <StarRateIcon color="warning" />
                            </Icon>
                          </Stack>
                          <Typography variant="caption">
                            ({el.totalReviews}{" "}
                            {el.totalReviews === 1 ? "review" : "reviews"})
                          </Typography>
                        </Stack>
                      </Box>
                    ))}
                </Carousel>
              </Box>
            )}
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            minHeight: "50vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Movie;
