import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Spinner from '../layout/Spinner';
import Moment from 'react-moment';
import {deleteComment} from '../../actions/post';


const CommentItem = ({postId, comment: {_id, text, name, avatar, user, date}}) => {

    return (
        <div>
            <div className="post bg-white p-1 my-1">
                <div>
                    <Link to={`/profile/${user}`}>
                        <img className="round-img"
                            src={avatar}
                            alt=""/>
                        <h4>{name}</h4>
                    </Link>
                </div>
                <div>
                    <p className="my-1">
                    {text}
                    </p>
                    <p className="post-date">
                        Posted on <Moment format={'YYYY/MM/DD'}>{date}</Moment>
                    </p>
                </div>
                </div>

                <div className="post bg-white p-1 my-1">
                <div>
                    <a href="profile.html">
                    <img
                        className="round-img"
                        src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
                        alt=""
                    />
                    <h4>John Doe</h4>
                    </a>
                </div>
                <div>
                    <p className="my-1">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
                    possimus corporis sunt necessitatibus! Minus nesciunt soluta
                    suscipit nobis. Amet accusamus distinctio cupiditate blanditiis
                    dolor? Illo perferendis eveniet cum cupiditate aliquam?
                    </p>
                    <p className="post-date">
                        Posted on 04/16/2019
                    </p>
                    <button      
                    type="button"
                    className="btn btn-danger"
                >
                    <i className="fas fa-times"></i>
                </button>
                </div>
            </div>
        </div>
    );
}


CommentItem.propTypes = {
    // getPost: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired,
    comment: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {})(CommentItem);