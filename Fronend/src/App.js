import { useEffect, useState } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import addNotification from 'react-push-notification';


import './App.css'
function App() {
  const [platform, setPlatform] = useState("facebook")
  const [company, setCompany] = useState("")
  const [postLimit, setPostLimit] = useState(5)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  const [comments, setComments] = useState([]);

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

    const senti=(score)=>{
    if (score < -0.1) 
    alert("Negative");
    addNotification({
        title: 'Negative',
        native:true        
      })
    
    
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
      <div className="main">
        {
          posts.length != 0 && (
            <>
              <img src={posts[0].user.profilePic} alt="" />
              <div className="main-page">Page Name: {posts[0].pageName}</div>
              <div className="main-url">facebook Url: <a href={posts[0].facebookUrl} target='_blank'>{posts[0].facebookUrl}</a></div>
              <div className="main-post">Name: {posts[0].user.name}</div>

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
            <td className='post-text'>{post.text}</td>
            <td className='post-likes'>{post.likes}</td>
            <td className='post-comments'>{post.comments}</td>
            <td className='post-shares'>{post.shares}</td>
            <button className='comment' onClick={() => fetchComments(post.url)}>View Comments</button>
          </tr>
        ))}
      </table>
      <h1>Comments</h1>
      <table>
        <tr className='com'>
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
            <button onClick={()=>senti(comment.score)}>Analyze</button>
          </tr>
        ))}
      </table>
      

    </div>
  );
}
export default App;
