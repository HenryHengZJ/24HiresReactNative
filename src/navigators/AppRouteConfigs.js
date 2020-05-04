import { createStackNavigator } from 'react-navigation';
import LoggedOut from '../screens/LoggedOut';
import JobDetail from '../screens/JobDetail';
import MapViewContainer from '../screens/MapViewContainer';
import StreetView from '../screens/StreetView';
import UserProfile from '../screens/UserProfile';
import OtherUserProfile from '../screens/OtherUserProfile';
import EditProfile from '../screens/EditProfile';
import Main from '../screens/Main';
import FilterJob from '../screens/FilterJob';
import FilterApplicant from '../screens/FilterApplicant';
import LocationContainer from '../screens/LocationContainer';
import CurrencyContainer from '../screens/CurrencyContainer';
import CategoryContainer from '../screens/CategoryContainer';
import WorkExp from '../screens/WorkExp';
import ResetPassword from '../screens/ResetPassword';
import Settings from '../screens/Settings';
import NearbyJob from '../screens/NearbyJob';
import PointsRewards from '../screens/PointsRewards';
import InviteFriends from '../screens/InviteFriends';
import LogIn from '../screens/LogIn';
import FirstLogin from '../screens/CreateProfile/FirstLogin';
import ForgotPassword from '../screens/ForgotPassword';
import SearchView from '../screens/SearchView';
import AllWorkExp from '../screens/AllWorkExp';
import AllReview from '../screens/AllReview';
import AllPostedJobs from '../screens/AllPostedJobs';
import HowItWorks from '../screens/HowItWorks';
import EmployerHowItWorks from '../screens/EmployerHowItWorks';
import ChatRoom from '../screens/ChatRoom';
import SearchResult from '../screens/SearchResult';
import TermsofService from '../screens/TermsofService';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import UpdateView from '../screens/UpdateView';
import EmployerLoggedOut from '../screens/EmployerLoggedOut';
import EmployerLoggedInTabNavigator from '../screens/EmployerLoggedInTabNavigator';
import EmployeeProfileContainer from '../screens/EmployeeProfileContainer';
import EmployerUserProfile from '../screens/EmployerUserProfile';
import EditEmployerProfile from '../screens/EditEmployerProfile';
import PhoneAuth1 from '../screens/PhoneAuth1';
import PhoneAuth2 from '../screens/PhoneAuth2';
import PhoneAuth3 from '../screens/PhoneAuth3';

import CreateJobCategory from '../screens/CreateJob/CreateJobCategory';
import CreateJobDescrip from '../screens/CreateJob/CreateJobDescrip';
import CreateJobLocation from '../screens/CreateJob/CreateJobLocation';
import CreateJobType from '../screens/CreateJob/CreateJobType';
import CreateJobSalary from '../screens/CreateJob/CreateJobSalary';
import CreateJobPayment from '../screens/CreateJob/CreateJobPayment';
import CreateJobDate from '../screens/CreateJob/CreateJobDate';
import CreateJobPreference from '../screens/CreateJob/CreateJobPreference';
import CreateJobOverview from '../screens/CreateJob/CreateJobOverview';

import CreateProfileName from '../screens/CreateProfile/CreateProfileName';
import CreateProfileEmail from '../screens/CreateProfile/CreateProfileEmail';
import CreateProfileBirthDate from '../screens/CreateProfile/CreateProfileBirthDate';
import CreateProfileWorkExperience from '../screens/CreateProfile/CreateProfileWorkExperience';
import CreateProfileEducation from '../screens/CreateProfile/CreateProfileEducation';
import CreateProfileLanguage from '../screens/CreateProfile/CreateProfileLanguage';

import LoggedInTabNavigator from './LoggedInTabNavigator';
import ChatBot from '../screens/ChatBot';



import { StatusBar, Platform } from 'react-native';

const AppRouteConfigs = createStackNavigator({
Main: { 
    screen: Main,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
LoggedOut: { 
    screen: LoggedOut,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
LogIn: { 
    screen: LogIn,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
FirstLogin: { 
    screen: FirstLogin,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
ForgotPassword: { 
    screen: ForgotPassword,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
LoggedIn: {
    screen: LoggedInTabNavigator,
    navigationOptions: {
        header: null,
        gesturesEnabled: false,
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
TermsofService: {
    screen: TermsofService,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
PrivacyPolicy: {
    screen: PrivacyPolicy,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CreateProfileName: { 
    screen: CreateProfileName,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CreateProfileEmail: { 
    screen: CreateProfileEmail,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CreateProfileBirthDate: { 
    screen: CreateProfileBirthDate,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CreateProfileWorkExperience: { 
    screen: CreateProfileWorkExperience,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CreateProfileEducation: { 
    screen: CreateProfileEducation,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CreateProfileLanguage: { 
    screen: CreateProfileLanguage,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
UserProfile: { 
    screen: UserProfile,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
OtherUserProfile: { 
    screen: OtherUserProfile,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
EditProfile: { 
    screen: EditProfile,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
ResetPassword: { 
    screen: ResetPassword,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
AllReview: { 
    screen: AllReview,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
AllWorkExp: { 
    screen: AllWorkExp,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
AllPostedJobs: { 
    screen: AllPostedJobs,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
HowItWorks: { 
    screen: HowItWorks,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
EmployerHowItWorks: { 
    screen: EmployerHowItWorks,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
SearchView:  { 
    screen: SearchView,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
JobDetail: { 
    screen: JobDetail,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
MapView: { 
    screen: MapViewContainer,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
StreetView: { 
    screen: StreetView,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
FilterJob: { 
    screen: FilterJob,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
FilterApplicant: { 
    screen: FilterApplicant,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
WorkExp: { 
    screen: WorkExp,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
LocationContainer: { 
    screen: LocationContainer,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CurrencyContainer: { 
    screen: CurrencyContainer,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CategoryContainer: { 
    screen: CategoryContainer,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
Settings: { 
    screen: Settings,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
NearbyJob: { 
    screen: NearbyJob,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
PointsRewards: { 
    screen: PointsRewards,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
InviteFriends: { 
    screen: InviteFriends,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
ChatRoom: { 
    screen: ChatRoom,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
SearchResult: { 
    screen: SearchResult,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
UpdateView: { 
    screen: UpdateView,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
EmployerLoggedOut: { 
    screen: EmployerLoggedOut,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
EmployerLoggedInTabNavigator: { 
    screen: EmployerLoggedInTabNavigator,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
EmployeeProfileContainer: { 
    screen: EmployeeProfileContainer,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
            borderBottomWidth: 0,
            shadowColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: '#fff',
        },
    }
},
EmployerUserProfile: { 
    screen: EmployerUserProfile,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
EditEmployerProfile: { 
    screen: EditEmployerProfile,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
PhoneAuth1: { 
    screen: PhoneAuth1,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
PhoneAuth2: { 
    screen: PhoneAuth2,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
PhoneAuth3: { 
    screen: PhoneAuth3,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},

CreateJobCategory: { 
    screen: CreateJobCategory,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CreateJobDescrip: { 
    screen: CreateJobDescrip,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CreateJobLocation: { 
    screen: CreateJobLocation,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CreateJobType: { 
    screen: CreateJobType,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CreateJobSalary: { 
    screen: CreateJobSalary,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CreateJobPayment: { 
    screen: CreateJobPayment,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CreateJobDate: { 
    screen: CreateJobDate,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CreateJobPreference: { 
    screen: CreateJobPreference,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CreateJobOverview: { 
    screen: CreateJobOverview,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},

ChatBot: { 
    screen: ChatBot,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},

},
{initialRouteName:'Main'}
);




export default AppRouteConfigs;
  