package com.project.secu.common.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class DateUtil {

	public static String getToDate(String... formats) {
		String format = "yyyy-MM-dd HH:mm:ss.SSS";
		if (formats != null && formats.length == 1) {
			format = formats[0];
		}
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		Calendar cal = Calendar.getInstance();
		return sdf.format(cal.getTime());
	}
}
