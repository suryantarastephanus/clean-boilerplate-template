import DashboardController from './DashboardController'
import UserController from './UserController'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
UserController: Object.assign(UserController, UserController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers