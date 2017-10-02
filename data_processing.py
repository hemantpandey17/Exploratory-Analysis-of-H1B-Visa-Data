import pandas as pd
import numpy as np
import random
import sys
# import  csv
# import json
# import getopt,pprint
# from sklearn import cluster as Kcluster, metrics as SK_Metrics
# from sklearn.decomposition import PCA
# from sklearn.manifold import Isomap,MDS
# from nltk.stem.snowball import SnowballStemmer
# from nltk.corpus import stopwords
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.decomposition import TruncatedSVD
# from sklearn.feature_extraction.text import CountVectorizer
# from sklearn.preprocessing import Normalizer
import math
# from pymongo import MongoClient

 

def createYearwiseCount(key, data_frame_original):
	df = pd.DataFrame({'count' : data_frame_original.groupby( [ key, "YEAR"] ).size()}).reset_index()
	df = df.sort_values(['YEAR','count',key], ascending=[False,False,True])
	temp = df.head(50)
	temp['2016'] = temp['count']

	x = df[key].isin(temp[key].tolist()) 
	y = (df['YEAR']==2015)
	m1 = df.loc[x & y]
	m1['2015'] = m1['count']
	m1 = m1[[key,'2015']]
	# print m1.head()

	y = (df['YEAR']==2014)
	m2 = df.loc[x & y]
	m2['2014'] = m2['count']
	m2 = m2[[key,'2014']]
	# print m2.head()

	y = (df['YEAR']==2013)
	m3 = df.loc[x & y]
	m3['2013'] = m3['count']
	m3 = m3[[key,'2013']]
	# print m3.head()
	 
	y = (df['YEAR']==2012)
	m4 = df.loc[x & y]
	m4['2012'] = m4['count']
	m4 = m4[[key,'2012']]
	# print m4.head()

	y = (df['YEAR']==2011)
	m5 = df.loc[x & y]
	m5['2011'] = m5['count']
	m5 = m5[[key,'2011']]
	# print m5.head()

	temp = pd.merge(temp, m1, on=key)
	temp = pd.merge(temp, m2, on=key)
	temp = pd.merge(temp, m3, on=key)
	temp = pd.merge(temp, m4, on=key)
	temp = pd.merge(temp, m5, on=key)

	temp = temp[[key,'2016','2015','2014','2013','2012','2011']]
	temp['total'] = temp['2011']+temp['2012']+temp['2013']+temp['2014']+temp['2015']+temp['2016']
	temp.to_csv(data_path+'appcount_'+key.lower()+'_yearwise.csv', encoding="utf-8")

	return temp


def createAppCount(key, data_frame_original):
	df = data_frame_original[key].value_counts()
	df = pd.DataFrame({key:df.index.values,'count':df})
	df = df.sort_values(['count',key], ascending=[False,True])
	df.index = range(len(df.index.values))
	# print df.head()
	df.to_csv(data_path+'appcount_'+key.lower()+'.csv', encoding="utf-8")

def createWageFiles(key, data_frame_original):
	df = data_frame_original[[key,'PREVAILING_WAGE']]
	df = df.sort_values(['PREVAILING_WAGE',key], ascending=[False,True])
	df.index = range(len(df.index.values))
	# print df.head()
	df.to_csv(data_path+key.lower()+'_wages.csv', encoding="utf-8") # for BOX Plot

def createBoxPlotData(key, data_frame_original):
	df = data_frame_original[[key, 'PREVAILING_WAGE']]
	df_count = pd.DataFrame({'count' : df.groupby( [key] ).size()}).reset_index()
	df_count = df_count.sort_values(['count',key], ascending=[False,True])
	temp1 = df_count.head(30)

	list_top = temp1[key].tolist()

	f = open(data_path+'box_'+key.lower()+'.csv','w')
	f.write(key+',min,max,median,q1,q3\n')
	for job in list_top:
		df_job = df.loc[df[key]==job]
		df_quantile = df_job['PREVAILING_WAGE'].quantile([0,0.25,0.5,0.75,1])
		l = df_quantile.tolist()
		f.write(job+','+str(l[0])+','+str(l[4])+','+str(l[2])+','+str(l[1])+','+str(l[3])+'\n')
	f.close()

def createParallelData(data_frame_original):

	df = data_frame_original[['CASE_STATUS', 'EMPLOYER_NAME', 'SOC_NAME', 'JOB_TITLE', 'FULL_TIME_POSITION','PREVAILING_WAGE' ,'YEAR', 'STATE', 'CITY']]
	df.to_csv(data_path+'h1b_kaggle_part.csv', encoding="utf-8")

def createParallelDataState(data_frame_original, mapping):
	df = pd.DataFrame({'count' : data_frame_original.groupby( [ 'EMPLOYER_NAME'] ).size()}).reset_index()
	df = df.sort_values(['count','EMPLOYER_NAME'], ascending=[False,True])
	temp1 = df.head(30)

	df = pd.DataFrame({'count' : data_frame_original.groupby( [ 'JOB_TITLE'] ).size()}).reset_index()
	df = df.sort_values(['count','JOB_TITLE'], ascending=[False,True])
	temp2 = df.head(30)

	list_top_emp = temp1['EMPLOYER_NAME'].tolist()
	list_top_job = temp2['JOB_TITLE'].tolist()

	df = data_frame_original[['CASE_STATUS', 'EMPLOYER_NAME', 'SOC_NAME', 'JOB_TITLE', 'FULL_TIME_POSITION','PREVAILING_WAGE' ,'YEAR', 'STATE', 'CITY']]
	x = df['EMPLOYER_NAME'].isin(list_top_emp) 
	y = df['JOB_TITLE'].isin(list_top_job)
	temp = df.loc[x & y]

	temp = pd.merge(temp, mapping, on='STATE', how='inner')
	d = pd.DataFrame({'count' : temp.groupby( ['ID'] ).size()}).reset_index()
	l = d['ID'].tolist()
	for val in l:
		df = temp.loc[temp['ID']==val]
		# print df.head()
		df = df[[ 'FULL_TIME_POSITION', 'EMPLOYER_NAME', 'JOB_TITLE', 'PREVAILING_WAGE' ,'YEAR','SOC_NAME', 'CITY', 'CASE_STATUS']]

		df_cities = pd.DataFrame({'count' : df.groupby( [ 'CITY'] ).size()}).reset_index()
		df_cities = df_cities.sort_values(['count','CITY'], ascending=[False,True])
		temp1 = df_cities.head(30)
		list_top_cities = temp1['CITY'].tolist()

		df = df.loc[df['CITY'].isin(list_top_cities)]
		
		df.to_csv('data/parallel/'+val+'.csv', encoding='utf-8')

def createLineChartData(data_frame_original):
	# Yearwise count
	df = data_frame_original['YEAR'].value_counts()
	df = pd.DataFrame({'YEAR':df.index.values,'count':df})
	df = df.sort_values(['YEAR'], ascending=[True])
	df.index = range(len(df.index.values))

	df.to_csv(data_path+'year_applicants.csv', encoding='utf-8')

	#Yearwise count for 3 categories
	df = data_frame_original.groupby(["YEAR", "CASE_STATUS"]).size().reset_index(name="Count")
	store = dict() # {2011:{'CASE_WITHDRAWN': count, 'status':count}}
	status_list = []
	year_list = []
	for index, row in df.iterrows():
		year = row['YEAR']
		status = row['CASE_STATUS']
		count = row['Count']
		if(status not in status_list):
			status_list.append(status)
		if(year not in year_list):
			year_list.append(year)
		try:
			store[year][status] = count
		except Exception as e:
			store[year] = dict()
			store[year][status] = count

	year_list = sorted(year_list)
	print year_list
	f = open(data_path+'year_case_status.csv','w')
	f.write('YEAR,')
	string = ''
	for status in status_list:
		string+=status+','
	string = string[:-1]
	f.write(string+'\n')
	for year in year_list:
		string = str(year)+','
		for status in status_list:
			try:
				string+= str(store[year][status])+','
			except Exception:
				string+= str(0)+','
		string = string[:-1]
		f.write(string+'\n')
	f.close()


if __name__=='__main__':

	data_path = "data/"

	data_frame_original = pd.read_csv("data/h1b_kaggle.csv",encoding="utf-8",na_values=[''])
	data_frame_original = data_frame_original.dropna(axis=0, how='any')

	#columns are - ['Unnamed: 0' 'CASE_STATUS' 'EMPLOYER_NAME' 'SOC_NAME' 'JOB_TITLE'
	#'FULL_TIME_POSITION' 'PREVAILING_WAGE' 'YEAR' 'WORKSITE' 'lon' 'lat']

	# print data_frame_original.columns.values

	data_frame_original['CITY'], data_frame_original['STATE'] = data_frame_original['WORKSITE'].str.split(',',1).str
	data_frame_original['CITY'] = data_frame_original['CITY'].map(lambda x: x.strip())
	data_frame_original['STATE'] = data_frame_original['STATE'].map(lambda x: x.strip())

	# # # Application Count for each state

	# createAppCount('STATE', data_frame_original)s

	# # # Application count for each employer

	# createAppCount('EMPLOYER_NAME', data_frame_original)

	# # # Application count for each Job Title

	# createAppCount('JOB_TITLE', data_frame_original)


	# # # Wages for Job Titles
	
	# createWageFiles('JOB_TITLE', data_frame_original)

	# # # Wages for Employers

	# createWageFiles('EMPLOYER_NAME', data_frame_original)

	# # ## Yearwise valuecount

	# # # Employer vs Number of Applicatons | Yearwise
	# createYearwiseCount('EMPLOYER_NAME', data_frame_original)

	# # #Job Title vs Number of Applications | Yearwise
	# createYearwiseCount('JOB_TITLE', data_frame_original)

	# # State vs Number of Applications | Yearwise
	# temp = createYearwiseCount('STATE', data_frame_original)

	ids = ["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
  	"ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH", 
  	"MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT", 
  	"CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN", 
  	"WI", "MO", "AR", "OK", "KS", "LS", "VA"]
  	
  	states = ['HAWAII', 'ALASKA','FLORIDA','SOUTH CAROLINA','GEORGIA','ALABAMA','NORTH CAROLINA',
  	'TENNESSEE','RHODE ISLAND','CONNECTICUT','MASSACHUSETTS','MAINE','NEW HAMPSHIRE','VERMONT',
  	'NEW YORK','NEW JERSEY','PENNSYLVANIA','DELAWARE','MARYLAND','WEST VIRGINA','KENTUCKY','OHIO',
  	'MICHIGAN','WYOMING','MONTANA','IDAHO','WASHINGTON','DISTRICT OF COLUMBIA','TEXAS','CALIFORNIA',
  	'ARIZONA','NEVADA','UTAH','COLORADO','NEW MEXICO','OREGON','NORTH DAKOTA','SOUTH DAKOTA',
  	'NEBRASKA','IOWA','MISSISSIPPI','INDIANA','ILLINOIS','MINNESOTA','WISCONSIN','MISSOURI','ARKANSAS','OKLAHOMA',
  	'KANSAS','LOUISIANA','VIRGINIA']

  	# print len(ids), len(states)
  	# print ids
  	# print states

  	mapping = pd.DataFrame({'STATE':states, 'ID':ids});

  	# merged = pd.merge(temp, mapping, on='STATE', how='inner')

  	# merged.to_csv(data_path+'appcount_state_yearwise_withid.csv', encoding="utf-8")

	# createBoxPlotData('JOB_TITLE', data_frame_original)
	# createBoxPlotData('EMPLOYER_NAME', data_frame_original)
	# createBoxPlotData('STATE', data_frame_original)

	createParallelDataState(data_frame_original, mapping)


	# createLineChartData(data_frame_original)