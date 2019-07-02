import React, {useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import DashboardActions from './DashboardActons';
import {getCurrentProfile, deleteAccount} from '../../actions/profile';
import Spinner from '../layout/Spinner';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({getCurrentProfile, deleteAccount, auth: {user}, profile: {profile, loading}}) => {
// useEffect analaogichen componentDidMount i componentDidUpdate
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    return loading && profile === null? <Spinner />: <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fa fa-user"/> Welcome {user && user.name}
        </p>
        { profile !== null ? (
        <Fragment>
            <DashboardActions />
            {profile.experience.length > 0 ? (<Experience experience={profile.experience} />) : (<Fragment>
                <h3 className="my-2">No Experience Added</h3>
            </Fragment>)}
            {profile.educations.length > 0 ? (<Education education={profile.educations} />) : (<Fragment>
                <h3 className="my-2">No Education Added</h3>
            </Fragment>)}
            

            <div className="my-2">
                <button className="btn btn-danger" onClick={() => deleteAccount()}>
                    <i className="fa fa-user" /> Delete My Account
                </button>
            </div>
        </Fragment>) : (
        <Fragment>
            <p>You have not yet setup a profile, please add some info</p>    
            <Link to="/create-profile" className="btn btn-primary my-1">
                Create Profile
            </Link>
        </Fragment>) }
    </Fragment> ;
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile,
})

export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard);
