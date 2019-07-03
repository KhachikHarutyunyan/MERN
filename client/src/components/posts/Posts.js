import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import {getPosts} from '../../actions/post';

const Posts = ({ getPosts, post: {posts, loading} }) => {
    useEffect(() => {
        getPosts();
    }, [getPosts]);

    return (
        <div>POSTS</div>
    );
}

const mapStateToProps = state => ({
    post: state.post
});

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, {getPosts})(Posts);