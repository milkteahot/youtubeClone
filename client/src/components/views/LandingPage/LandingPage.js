import React, { useEffect, useState } from "react";
import { Card, Avatar, Col, Typography, Row, Form, Input } from "antd";
import Axios from "axios";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";

const { Meta } = Card;
const { Search } = Input;

function LandingPage() {
  const [SearchBar, setSearchBar] = useState("");

  const onSearch = e => {
    setSearchBar(e.currentTarget.value);
  };

  const [Video, setVideo] = useState([]);

  useEffect(() => {
    Axios.get("/api/video/getVideos").then(response => {
      if (response.data.success) {
        console.log(response.data);
        setVideo(response.data.videos);
      } else {
        alert("비디오 가져오기를 실패했습니다.");
      }
    });
  }, []);
  const renderCards = Video.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={8} md={8} xs={24}>
        <a href={`/video/post/${video._id}`}>
          <div style={{ position: "relative" }}>
            <img
              style={{ width: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
            />
            <div className="duration">
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </div>
        </a>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image} />}
          writer={video.writer.name}
        />
        <Meta title={video.title} style={{margin: "0"}}/>
        {/* <Meta description=""/> */}
        
        <br />
        <span style={{ marginLeft: "3rem" }}>{video.views} views</span> -
        <span> {moment(video.createdAt).format("MMM Do YY")} </span>
      </Col>
    );
  });

  return (
    <div>
      <div
        className="banner"
        style={{
          width: "100%",
          height: "30vh",
          background: "linear-gradient(135deg, #f1c110, #ff1616d6)"
        }}
      >
        <Search
        className="search-bar"
        placeholder="다른 작가들의 세계관을 탐험해보세요"
        onChange={onSearch}
        value={SearchBar}
        style={{width:"60vw", display:"flex", margin:"0 20%"}}
      />
      </div>
      <div style={{ width: "85%", margin: "3rem auto" }}>
        {/* <Title level={2}>최다 추천</Title> */}
        <ul className="landing-ul">
          <a href="/">
            <li className="landing-li">최다 추천</li>
          </a>
          <a href="/">
            <li className="landing-li">최신 등록</li>
          </a>
          <a href="/">
            <li className="landing-li">최고 인기</li>
          </a>
        </ul>

        <Row gutter={[32, 16]}>{renderCards}</Row>
      </div>
    </div>
  );
}

export default LandingPage;
