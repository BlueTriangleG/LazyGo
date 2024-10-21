import React from 'react';

const plusVisited = async (title: string, email: string) => {
  try {
    // 发起 GET 请求，通过 email 和 title 查询数据库
    const checkResponse = await fetch(`/(api)/VisitedPlaces?email=${email}&title=${title}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const checkResult = await checkResponse.json();
    
    // 检查响应状态
    if (checkResponse.ok) {
      if (checkResult.length > 0) {
        console.log('Record found:', checkResult[0]);
        
        const visitCount = checkResult[0].visit_count + 1; // 增加访问计数
        const id = checkResult[0].id;
        console.log('Updated visit count:', visitCount);

        // 使用 DELETE 请求删除记录
        const deleteResponse = await fetch(`/(api)/VisitedPlaces?email=${email}&title=${title}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // 检查删除请求的响应
        if (deleteResponse.ok) {
          console.log('Record deleted successfully.');
          
          // 删除后重新插入一条数据，保持 email 和 title 不变，visit_count 更新
          const insertResponse = await fetch(`/(api)/VisitedPlaces`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              title,
              visit_count: visitCount, // update visit_count
              id,
            }),
          });

          // 检查插入请求的响应
          if (insertResponse.ok) {
            console.log('New record inserted successfully with updated visit count.');
          } else {
            const insertResult = await insertResponse.json();
            console.error('POST request failed:', insertResult);
          }

        } else {
          const deleteResult = await deleteResponse.json();
          console.error('DELETE request failed:', deleteResult);
        }

      } else {
        // 如果没有找到记录，插入新的记录
        console.log('No record found for the given title and email. Inserting new record.');
        
        const insertResponse = await fetch(`/(api)/VisitedPlaces`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            title,
            visit_count: 1, // 初始 visit_count 为 1
          }),
        });

        // 检查插入请求的响应
        if (insertResponse.ok) {
          console.log('New record inserted successfully with visit count set to 1.');
        } else {
          const insertResult = await insertResponse.json();
          console.error('POST request failed:', insertResult);
        }
      }
    } else {
      console.error('GET request failed:', checkResult);
    }
  } catch (error) {
    console.error('Error fetching data from the database:', error);
  }
};

export default plusVisited;
