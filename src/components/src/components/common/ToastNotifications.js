import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { clearAlerts } from '../../redux/actions/common/alert.action';

export function ToastNotifications() {

	const alerts = useSelector(state => state.Alert);
	const dispatch = useDispatch();
	const { addToast } = useToasts();

	React.useEffect(() => {
		if (alerts && alerts.length) {
			alerts.forEach((alert) => {
				addToast(
					<div>
						<strong>{alert.title}</strong>
						<div>{alert.body}</div>
					</div>
					, {
						appearance: alert.type,
						autoDismiss: true,
						id: alert.id,
					});
				setTimeout(() => {
					// removeToast(alert.id);
					dispatch(clearAlerts());
				}, alert.timeout);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [alerts]);
	return null;

}