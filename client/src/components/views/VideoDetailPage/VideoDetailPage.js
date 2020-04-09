import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import Axios from "axios";
import SideVideo from "./Section/SideVideo";

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId
  const [VideoDetail, setVideoDetail] = useState([])

  const variable = { videoId: videoId };

  useEffect(() => {
    Axios.post("/api/video/getVideoDetail", variable).then(response => {
      if (response.data.success) {
        setVideoDetail(response.data.videoDetail);
        // console.log(VideoDetail.filePath)
      } else {
        alert("비디오 정보를 가져오기 실패했습니다.");
      }
    });
  }, []);

  if (VideoDetail.writer) {
    return (
      <Row>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
          <img style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.thumbnail}`} controls /> 
            <List.Item actions>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={VideoDetail.writer && VideoDetail.writer.image}
                  />
                }
                title={<a href="#">{VideoDetail.title}</a>}
                description={VideoDetail.description}
              />
            </List.Item>

            {/* Comments */}
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>...loading</div>;
  }
}

export default VideoDetailPage;
