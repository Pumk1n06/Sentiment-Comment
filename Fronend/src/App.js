import { useEffect, useState } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import './App.css'
function App() {
  const [platform, setPlatform] = useState("facebook")
  const [company, setCompany] = useState("")
  const [postLimit, setPostLimit] = useState(5)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  const [comments, setComments] = useState([]);
  // const [comments, setComments] = useState([
  //   {
  //     "facebookUrl": "https://www.facebook.com/cisco/posts/pfbid037qCpjyKGtHmR27P7FTeHkLM5yaCBYHGGCm1nRyGMbM9xGwuoeeUCciwTTvZ6qrtZl",
  //     "commentUrl": "https://www.facebook.com/cisco/posts/pfbid037qCpjyKGtHmR27P7FTeHkLM5yaCBYHGGCm1nRyGMbM9xGwuoeeUCciwTTvZ6qrtZl?comment_id=1429848010948513",
  //     "id": "Y29tbWVudDo5NjI1NTc3MjE4OTQzNjNfMTQyOTg0ODAxMDk0ODUxMw==",
  //     "feedbackId": "ZmVlZGJhY2s6OTYyNTU3NzIxODk0MzYzXzE0Mjk4NDgwMTA5NDg1MTM=",
  //     "date": "2024-03-08T10:12:10.000Z",
  //     "text": "Salute",
  //     "profileUrl": "https://www.facebook.com/people/Marlon-Figueredo/100093298181468/",
  //     "profilePicture": "https://scontent-dfw5-2.xx.fbcdn.net/v/t39.30808-1/352199312_743752320821306_6435057811716869041_n.jpg?stp=cp0_dst-jpg_p32x32&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=rrk_OtH2KvEAX_Vao4M&_nc_ht=scontent-dfw5-2.xx&oh=00_AfC5wqKS6TBhP8IBPoYQ-fSrTKPmAKM2RMf3JzKxzxX3EA&oe=65F2EFF2",
  //     "profileId": "100093298181468",
  //     "profileName": "Marlon Figueredo",
  //     "likesCount": 1,
  //     "commentsCount": 1,
  //     "facebookId": "962557721894363",
  //     "postTitle": "In honor of #IWD, Cisco’s Chief Sustainability Officer, Mary de Wysocki, reflects on how women’s leadership and creativity in the climate innovation space helps us build resilient ecosystems. Read more: http://cs.co/6183XYvJh",
  //     "pageAdLibrary": {
  //       "is_business_page_active": false,
  //       "id": "10084673031"
  //     }
  //   }
  // ]);

  const fetchComments = (link) => {
    // Fetch comments data for a specific link
    setLoading(true)
    axios.get(`comments?link=${encodeURIComponent(link)}`)
      .then(response => {
        setComments(response.data.items);
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });
  };

  return (

    <div>
      {
        loading &&
        <div className="wrapper">
          <div class="loader"></div>
        </div>

      }

      <div className='search-box'>
        <label for='company'>Company</label>


        <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
        <label for='postlimit'>No of Posts</label>
        {/* <InputText value={postLimit} onChange={(e) => setPostLimit(e.target.value)} /> */}


        <input id="postlimit" type='number' value={postLimit} onChange={(e) => setPostLimit(e.target.value)}/>
        <select name="platform" id="pf" value={platform} onChange={(e) => {
          setPlatform(e.target.value)
        }}>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="twitter">Twitter</option>
        </select>

        <button type='submit' onClick={() => {
          setLoading(true)
          axios.get(`/data?company=${company}&platform=${platform}&postLimit=${postLimit}`)
            .then(response => {
              setPosts(response.data.items);
              setLoading(false)
            })
            .catch(error => {
              console.error('Error fetching posts:', error);
            });
        }}>submit</button>
      </div>
      <div className="">
        {
          posts.length != 0 && (
            <>
              <img src={posts[0].user.profilePic} alt="" />
              <div className="">Page Name: {posts[0].pageName}</div>
              <div className="">facebook Url: <a href={posts[0].facebookUrl} target='_blank'>{posts[0].facebookUrl}</a></div>
              <div className="">Name: {posts[0].user.name}</div>

            </>
          )
        }
      </div>
      <h1>Posts</h1>
      <table>
        <tr>
          <th>Media</th>
          <th>Post Content</th>
          <th>Likes</th>
          <th>Comments</th>
          <th>Shares</th>
          <th>Fetch Comments</th>
        </tr>
        {posts.map((post) => (
          <tr key={post.postId}>
            <td><img src={post.media && post.media[0].thumbnail} /></td>
            <td>{post.text}</td>
            <td>{post.likes}</td>
            <td>{post.comments}</td>
            <td>{post.shares}</td>
            <button onClick={() => fetchComments(post.url)}>View Comments</button>
          </tr>
        ))}
      </table>
      <h1>Comments</h1>
      <table>
        <tr>
          <th>profileName</th>
          <th>Profile Pic</th>
          <th>Content</th>
          <th>Likes</th>
          <th>Comments</th>
          <th>Score</th>
        </tr>
        {comments.map((comment) => (
          <tr key={comment.id}>
            <td>{comment.profileName}</td>
            <td><img src={comment.profilePicture} /></td>
            <td>{comment.text}</td>
            <td>{comment.likesCount}</td>
            <td>{comment.commentsCount}</td>
            <td>{comment.score}</td>
          </tr>
        ))}
      </table>
      

    </div>
  );
}
export default App;
