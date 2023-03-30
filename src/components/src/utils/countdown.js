const time_remaining = (endtime, singleOrder) => {
	var t = Date.parse(endtime) - Date.parse(singleOrder?.datePlaced);
	var seconds = Math.floor( (t/1000) % 60 );
	var minutes = Math.floor( (t/1000/60) % 60 );
	var hours = Math.floor( (t/(1000*60*60)) % 24 );
	var days = Math.floor( t/(1000*60*60*24) );
	return {'total':t, 'days':days, 'hours':hours, 'minutes':minutes, 'seconds':seconds};
}
export const runClock = (endtime, singleOrder) => {
  let result;
	const update_clock = () => {
		var t = time_remaining(endtime, singleOrder);
		if(t.total<=0){ 
      clearInterval(timeinterval);
      result = 'Times Up!' 
    }
    else {
      result = t
    }
    return result
	}
	update_clock(); // run function once at first to avoid delay
	var timeinterval = setInterval(update_clock,1000);
}
